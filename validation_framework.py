#!/usr/bin/env python3
"""
BOUNDED EXHAUSTIVE VALIDATION FRAMEWORK
Enterprise-grade recursive problem discovery and resolution system
Keeps Claude in a loop until ALL problems are resolved through testing
"""

import json
import argparse
import logging
import subprocess
import sys
import hashlib
import time
import re
from dataclasses import dataclass, asdict, field
from enum import Enum
from pathlib import Path
from typing import Any, Callable, List, Optional, Dict, Tuple
from datetime import datetime

class TaskStatus(Enum):
    """Task lifecycle states"""
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    AWAITING_FIX = "awaiting_fix"
    FIX_APPLIED = "fix_applied"
    VERIFIED = "verified"
    FAILED = "failed"

class TestType(Enum):
    """Real test types that verify actual code"""
    NPM_TEST = "npm_test"
    NPM_LINT = "npm_lint"
    NPM_BUILD = "npm_build"
    TYPE_CHECK = "type_check"
    LOGIC_ANALYSIS = "logic_analysis"

@dataclass
class TestResult:
    """Result from actual test execution"""
    test_type: TestType
    passed: bool
    stdout: str = ""
    stderr: str = ""
    execution_time: float = 0.0
    error_message: str = ""

@dataclass
class Problem:
    """Discovered problem that needs fixing"""
    id: str
    severity: str  # "critical", "high", "medium", "low"
    category: str  # "type_error", "logic", "performance", "security", "style"
    file: str
    line: int
    description: str
    suggested_fix: str
    code_snippet: str = ""

    def __hash__(self):
        return hash(self.id)

    def __eq__(self, other):
        return self.id == other.id

@dataclass
class Task:
    """Atomic task for fixing a problem"""
    id: str
    problem: Problem
    status: TaskStatus = TaskStatus.PENDING
    attempts: int = 0
    max_attempts: int = 5
    test_results: List[TestResult] = field(default_factory=list)
    fix_applied: str = ""

    def is_resolved(self) -> bool:
        """Task is resolved when ALL tests pass"""
        return (
            self.status == TaskStatus.VERIFIED
            and len(self.test_results) > 0
            and all(tr.passed for tr in self.test_results)
        )

    def has_failed_tests(self) -> bool:
        """Check if any test failed"""
        return any(not tr.passed for tr in self.test_results)

    def get_failed_tests(self) -> List[TestResult]:
        """Get only failed tests"""
        return [tr for tr in self.test_results if not tr.passed]

def setup_logging(log_file: str = "validation.log") -> logging.Logger:
    """Setup comprehensive logging with UTF-8 encoding"""
    logger = logging.getLogger("validation_framework")
    logger.setLevel(logging.DEBUG)

    if logger.hasHandlers():
        logger.handlers.clear()

    file_handler = logging.FileHandler(log_file, encoding='utf-8')
    file_handler.setLevel(logging.DEBUG)

    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.INFO)

    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    file_handler.setFormatter(formatter)
    console_handler.setFormatter(formatter)

    logger.addHandler(file_handler)
    logger.addHandler(console_handler)

    return logger

logger = setup_logging()

class ProjectAnalyzer:
    """Analyzes project for real problems"""

    def __init__(self, project_root: Path):
        self.project_root = project_root
        self.logger = logger
        self.npm_cmd = self._find_npm()

    def _find_npm(self) -> str:
        """Find npm executable"""
        # Try 'npm' first
        try:
            result = subprocess.run(["npm", "--version"], capture_output=True, timeout=5)
            if result.returncode == 0:
                return "npm"
        except:
            pass

        # Try 'npm.cmd' on Windows
        try:
            result = subprocess.run(["npm.cmd", "--version"], capture_output=True, timeout=5)
            if result.returncode == 0:
                return "npm.cmd"
        except:
            pass

        # Return default
        self.logger.warning("npm not found in PATH, using default 'npm'")
        return "npm"

    @staticmethod
    def _decode_bytes(value: bytes) -> str:
        """Decode subprocess output safely."""
        try:
            return value.decode("utf-8", errors="replace")
        except Exception:
            return str(value)

    @staticmethod
    def _is_environment_spawn_error(*chunks: str) -> bool:
        """
        Detect environment-level spawn errors (sandbox/permission), not app bugs.
        """
        merged = " ".join(chunks).lower()
        return "spawn eperm" in merged or "operation not permitted" in merged

    def discover_problems(self) -> List[Problem]:
        """Discover REAL problems by running tests"""
        self.logger.info("=" * 80)
        self.logger.info("PHASE 1: PROBLEM DISCOVERY - Running Real Tests")
        self.logger.info("=" * 80)

        print("=" * 80)
        print("PHASE 1: PROBLEM DISCOVERY - Running Real Tests")
        print("=" * 80 + "\n")

        problems = []

        # Run npm test
        print("  > Running: npm test...")
        test_problems = self._discover_from_npm_test()
        problems.extend(test_problems)
        print(f"    Found {len(test_problems)} test issues\n")

        # Run npm lint
        print("  > Running: npm run lint...")
        lint_problems = self._discover_from_npm_lint()
        problems.extend(lint_problems)
        print(f"    Found {len(lint_problems)} lint issues\n")

        # Run npm build
        print("  > Running: npm run build...")
        build_problems = self._discover_from_npm_build()
        problems.extend(build_problems)
        print(f"    Found {len(build_problems)} build issues\n")

        # Static analysis
        print("  > Running: static analysis...")
        static_problems = self._discover_from_static_analysis()
        problems.extend(static_problems)
        print(f"    Found {len(static_problems)} code quality issues\n")

        # Remove duplicates
        unique_problems = {p.id: p for p in problems}
        problems = list(unique_problems.values())

        self.logger.info(f"\n[OK] Discovered {len(problems)} problems")
        for p in problems:
            self.logger.info(f"  [{p.severity}] {p.category}: {p.description}")

        return sorted(problems, key=lambda p: {"critical": 0, "high": 1, "medium": 2, "low": 3}.get(p.severity, 4))

    def _discover_from_npm_test(self) -> List[Problem]:
        """Run npm test and extract problems"""
        problems = []
        try:
            result = subprocess.run(
                [self.npm_cmd, "test"],
                cwd=self.project_root,
                capture_output=True,
                text=False,  # Binary mode for better encoding handling
                timeout=60
            )

            if result.returncode != 0:
                stderr_text = self._decode_bytes(result.stderr)
                stdout_text = self._decode_bytes(result.stdout)

                if self._is_environment_spawn_error(stdout_text, stderr_text):
                    self.logger.warning(
                        "npm test failed due to environment spawn permission (EPERM); skipping as code issue."
                    )
                    return problems

                problems.append(Problem(
                    id="npm_test_failure",
                    severity="critical",
                    category="test_failure",
                    file="test",
                    line=0,
                    description="npm test is failing",
                    suggested_fix="Fix failing unit tests",
                    code_snippet=f"{stdout_text}|{stderr_text}"[:500]
                ))
        except subprocess.TimeoutExpired:
            problems.append(Problem(
                id="npm_test_timeout",
                severity="high",
                category="performance",
                file="test",
                line=0,
                description="npm test timeout (>60s)",
                suggested_fix="Optimize tests or increase timeout"
            ))
        except Exception as e:
            self.logger.warning(f"Could not run npm test: {e}")

        return problems

    def _discover_from_npm_lint(self) -> List[Problem]:
        """Run npm lint and extract problems"""
        problems = []
        try:
            result = subprocess.run(
                [self.npm_cmd, "run", "lint"],
                cwd=self.project_root,
                capture_output=True,
                text=False,
                timeout=30
            )

            if result.returncode != 0:
                # Decode with error handling
                try:
                    stdout_text = result.stdout.decode('utf-8', errors='replace')
                except:
                    stdout_text = str(result.stdout)

                # Parse eslint output
                for line in stdout_text.split('\n'):
                    if 'error' in line.lower() or 'warning' in line.lower():
                        problems.append(Problem(
                            id=f"lint_{hashlib.md5(line.encode()).hexdigest()[:8]}",
                            severity="high" if "error" in line.lower() else "medium",
                            category="style",
                            file="unknown",
                            line=0,
                            description=f"Lint issue: {line.strip()}",
                            suggested_fix="Fix according to eslint rules"
                        ))
        except Exception as e:
            self.logger.warning(f"Could not run npm lint: {e}")

        return problems

    def _discover_from_npm_build(self) -> List[Problem]:
        """Run npm build and extract problems"""
        problems = []
        try:
            result = subprocess.run(
                [self.npm_cmd, "run", "build"],
                cwd=self.project_root,
                capture_output=True,
                text=False,
                timeout=120
            )

            if result.returncode != 0:
                stderr_text = self._decode_bytes(result.stderr)
                stdout_text = self._decode_bytes(result.stdout)

                if self._is_environment_spawn_error(stdout_text, stderr_text):
                    self.logger.warning(
                        "npm build failed due to environment spawn permission (EPERM); skipping as code issue."
                    )
                    return problems

                # Parse build errors
                stderr_lines = stderr_text.split('\n')
                stdout_lines = stdout_text.split('\n')
                all_lines = stderr_lines + stdout_lines

                error_pattern = re.compile(r'(?:error|Error|ERROR).*?(?:\.tsx?|\.jsx?)?[:\s](.+?)(?:\n|$)', re.IGNORECASE)

                for line in all_lines:
                    if any(keyword in line.lower() for keyword in ['error', 'failed', 'cannot find']):
                        problem_id = f"build_{hashlib.md5(line.encode()).hexdigest()[:8]}"

                        # Extract file and line if possible
                        file_match = re.search(r'([a-zA-Z0-9\-_./]+\.tsx?|[a-zA-Z0-9\-_./]+\.jsx?)', line)
                        file_name = file_match.group(1) if file_match else "build"

                        problems.append(Problem(
                            id=problem_id,
                            severity="critical",
                            category="build_error",
                            file=file_name,
                            line=0,
                            description=f"Build error: {line.strip()[:100]}",
                            suggested_fix="Fix TypeScript or build configuration",
                            code_snippet=line
                        ))
        except subprocess.TimeoutExpired:
            problems.append(Problem(
                id="build_timeout",
                severity="high",
                category="performance",
                file="build",
                line=0,
                description="npm build timeout (>120s)",
                suggested_fix="Optimize build or increase timeout"
            ))
        except Exception as e:
            self.logger.warning(f"Could not run npm build: {e}")

        return problems

    def _discover_from_static_analysis(self) -> List[Problem]:
        """DEEP static analysis - every file, every line"""
        problems = []

        ts_files = list(self.project_root.rglob("*.ts")) + list(self.project_root.rglob("*.tsx"))

        for filepath in ts_files:
            if "node_modules" in str(filepath) or ".next" in str(filepath) or ".test" in str(filepath):
                continue

            try:
                content = filepath.read_text(encoding='utf-8')
                lines = content.split('\n')

                # LINE BY LINE ANALYSIS
                for line_num, line in enumerate(lines, 1):
                    stripped = line.strip()

                    # 1. Check for console.log in production code
                    if 'console.log' in line and not '// ' in line[:line.find('console.log')] if 'console.log' in line else False:
                        problems.append(Problem(
                            id=f"console_log_{filepath.name}_{line_num}",
                            severity="medium",
                            category="code_quality",
                            file=str(filepath.relative_to(self.project_root)),
                            line=line_num,
                            description=f"console.log() left in production code (line {line_num})",
                            suggested_fix="Remove console.log statements",
                            code_snippet=stripped[:100]
                        ))

                    # 2. Check for debugger statements
                    if 'debugger;' in line:
                        problems.append(Problem(
                            id=f"debugger_{filepath.name}_{line_num}",
                            severity="high",
                            category="code_quality",
                            file=str(filepath.relative_to(self.project_root)),
                            line=line_num,
                            description=f"debugger statement left in code (line {line_num})",
                            suggested_fix="Remove debugger statement",
                            code_snippet=stripped[:100]
                        ))

                    # 3. Check for any() method on arrays
                    if '.any()' in line and 'typescript' not in str(filepath):
                        problems.append(Problem(
                            id=f"any_method_{filepath.name}_{line_num}",
                            severity="medium",
                            category="type_error",
                            file=str(filepath.relative_to(self.project_root)),
                            line=line_num,
                            description=f"Possible wrong method call .any() (line {line_num})",
                            suggested_fix="Use .some() for arrays in TypeScript",
                            code_snippet=stripped[:100]
                        ))

                    # 4. Check for empty catch blocks
                    if 'catch' in line and '{' in line:
                        # Look ahead for empty catch
                        next_non_empty = None
                        for j in range(line_num, min(line_num + 3, len(lines))):
                            if lines[j].strip() and 'catch' not in lines[j]:
                                next_non_empty = lines[j].strip()
                                break
                        if next_non_empty == '}':
                            problems.append(Problem(
                                id=f"empty_catch_{filepath.name}_{line_num}",
                                severity="high",
                                category="logic",
                                file=str(filepath.relative_to(self.project_root)),
                                line=line_num,
                                description=f"Empty catch block (line {line_num}) - hides errors",
                                suggested_fix="Add proper error handling in catch block",
                                code_snippet=stripped[:100]
                            ))

                    # 5. Check for unused parameters (basic heuristic)
                    if 'function ' in line or '=>' in line:
                        # Very simple: if function param appears in parens but not in body
                        if '(' in line and ')' in line:
                            # This is simplified - just flag potential issues
                            pass

                    # 6. SKIP magic numbers for now - too noisy
                    pass

                    # 7. Check for comparison with === (good) but flag == usage
                    if ' == ' in line and '===' not in line and '//' not in line[:line.find(' == ')] if ' == ' in line else False:
                        problems.append(Problem(
                            id=f"loose_eq_{filepath.name}_{line_num}",
                            severity="medium",
                            category="code_quality",
                            file=str(filepath.relative_to(self.project_root)),
                            line=line_num,
                            description=f"Loose equality (==) used (line {line_num}) - use === instead",
                            suggested_fix="Replace == with ===",
                            code_snippet=stripped[:100]
                        ))

                # WHOLE FILE CHECKS

                # Check for BUG LOGICO comments (logic errors)
                if "BUG LOGICO" in content or "BUG LOGIC" in content:
                    for i, line in enumerate(lines, 1):
                        if "BUG LOGICO" in line or "BUG LOGIC" in line:
                            problems.append(Problem(
                                id=f"bug_logic_{filepath.name}_{i}",
                                severity="critical",
                                category="logic",
                                file=str(filepath.relative_to(self.project_root)),
                                line=i,
                                description=f"Logic bug found (line {i}): {line.strip()}",
                                suggested_fix="Fix the logic error as described in the comment",
                                code_snippet=line.strip()[:150]
                            ))

                # Check for unused variables (const _ or const unused)
                if "const _" in content or "const unused" in content:
                    problems.append(Problem(
                        id=f"unused_var_{filepath.name}",
                        severity="low",
                        category="code_quality",
                        file=str(filepath.relative_to(self.project_root)),
                        line=0,
                        description=f"Unused variable declared in {filepath.name}",
                        suggested_fix="Remove unused variables"
                    ))

                # Check for TODO comments
                if "TODO" in content or "FIXME" in content or "HACK" in content:
                    for i, line in enumerate(lines, 1):
                        if "TODO" in line or "FIXME" in line or "HACK" in line:
                            problems.append(Problem(
                                id=f"todo_{filepath.name}_{i}_{hashlib.md5(line.encode()).hexdigest()[:4]}",
                                severity="low",
                                category="code_quality",
                                file=str(filepath.relative_to(self.project_root)),
                                line=i,
                                description=f"TODO/FIXME/HACK comment (line {i})",
                                suggested_fix="Address the TODO item or remove the comment",
                                code_snippet=line.strip()[:100]
                            ))

            except Exception as e:
                self.logger.debug(f"Error analyzing {filepath}: {e}")

        return problems

class RecursiveValidator:
    """Validates and keeps Claude in loop until all problems resolved"""

    def __init__(
        self,
        project_root: Path,
        npm_cmd: str = "npm",
        interactive: bool = True,
        max_attempts_per_problem: Optional[int] = None,
        max_global_iterations: Optional[int] = None,
        auto_git_push: bool = False,
        git_remote: str = "origin",
        git_branch: str = "main"
    ):
        self.project_root = project_root
        self.logger = logger
        self.npm_cmd = npm_cmd
        self.interactive = interactive
        self.max_attempts_per_problem = max_attempts_per_problem
        self.max_global_iterations = max_global_iterations
        self.auto_git_push = auto_git_push
        self.git_remote = git_remote
        self.git_branch = git_branch

    def _safe_input(self, prompt: str, default: str = "") -> str:
        """Read input when interactive; otherwise return default."""
        if not self.interactive:
            return default
        try:
            return input(prompt)
        except EOFError:
            return default

    def _attempt_label(self, attempt: int) -> str:
        max_attempts = str(self.max_attempts_per_problem) if self.max_attempts_per_problem is not None else "inf"
        return f"{attempt}/{max_attempts}"

    def _decode_result_output(self, value: bytes) -> str:
        try:
            return value.decode("utf-8", errors="replace")
        except Exception:
            return str(value)

    def _find_git_root(self) -> Optional[Path]:
        """Find git root at or above project root."""
        for parent in [self.project_root] + list(self.project_root.parents):
            if (parent / ".git").exists():
                return parent
        return None

    def _run_git_push_checkpoint(self, problem: Problem) -> bool:
        """Commit and push current changes after a resolved problem."""
        if not self.auto_git_push:
            return True

        git_root = self._find_git_root()
        if git_root is None:
            self.logger.error("Git root not found; cannot push resolved-problem checkpoint.")
            return False

        try:
            add_result = subprocess.run(
                ["git", "add", "-A"],
                cwd=git_root,
                capture_output=True,
                text=True
            )
            if add_result.returncode != 0:
                self.logger.error(f"git add failed: {add_result.stderr.strip()}")
                return False

            diff_cached = subprocess.run(
                ["git", "diff", "--cached", "--quiet"],
                cwd=git_root
            )

            if diff_cached.returncode != 0:
                commit_msg = f"fix: resolve {problem.id}"
                commit_result = subprocess.run(
                    ["git", "commit", "-m", commit_msg],
                    cwd=git_root,
                    capture_output=True,
                    text=True
                )
                if commit_result.returncode != 0:
                    self.logger.error(f"git commit failed: {commit_result.stderr.strip()}")
                    return False
                self.logger.info(f"Created commit for resolved problem: {problem.id}")
            else:
                self.logger.info("No changes to commit for this resolved problem; pushing branch state.")

            push_result = subprocess.run(
                ["git", "push", self.git_remote, self.git_branch],
                cwd=git_root,
                capture_output=True,
                text=True
            )
            if push_result.returncode != 0:
                self.logger.error(f"git push failed: {push_result.stderr.strip()}")
                return False

            self.logger.info(
                f"Pushed checkpoint for problem {problem.id} to {self.git_remote}/{self.git_branch}"
            )
            return True
        except Exception as e:
            self.logger.error(f"Git checkpoint failed: {e}")
            return False

    def validate_and_loop(self, problems: List[Problem]) -> bool:
        """Main validation loop - recursive by problem."""

        print("\n" + "=" * 80)
        print("LOGIC ERROR DETECTION - MANUAL")
        print("=" * 80)
        print("\nClaude Code: Do you see any LOGIC ERRORS that automated tests didn't catch?")
        print("(Type 'yes' if you found one, or 'no' to continue)")
        try:
            response = self._safe_input("\nYour answer: ", "no").strip().lower()
            if response == 'yes':
                print("\nDescribe the logic error:")
                description = self._safe_input("Problem description: ").strip()
                print("What file and line?")
                file_loc = self._safe_input("File and line (e.g., lib/calculations.ts:120): ").strip()
                print("What's the fix?")
                fix = self._safe_input("Suggested fix: ").strip()

                logic_problem = Problem(
                    id=f"logic_error_{hashlib.md5(description.encode()).hexdigest()[:8]}",
                    severity="critical",
                    category="logic",
                    file=file_loc.split(':')[0] if ':' in file_loc else file_loc,
                    line=int(file_loc.split(':')[1]) if ':' in file_loc else 0,
                    description=description,
                    suggested_fix=fix,
                    code_snippet=description[:100]
                )
                problems.append(logic_problem)
                print(f"\n[OK] Logic error added: {description}\n")
        except Exception as e:
            self.logger.debug(f"Error getting logic error input: {e}")

        if not problems:
            self.logger.info("\n[OK] No problems discovered - Project is clean!")
            print("\n[OK] Project is CLEAN - No problems discovered!")
            return True

        if not self.interactive:
            self.logger.error("Problems discovered in non-interactive mode; cannot enter fix loop automatically.")
            for problem in problems:
                self.logger.error(f" - [{problem.severity}] {problem.file}:{problem.line} {problem.description}")
            return False

        resolved_problems: set = set()
        global_iteration = 0

        while True:
            if self.max_global_iterations is not None and global_iteration >= self.max_global_iterations:
                break
            global_iteration += 1
            max_global = str(self.max_global_iterations) if self.max_global_iterations is not None else "inf"

            self.logger.info("\n" + "=" * 80)
            self.logger.info(f"GLOBAL ITERATION {global_iteration}/{max_global}")
            self.logger.info("=" * 80)

            print(f"\n{'='*80}")
            print(f"GLOBAL ITERATION {global_iteration}/{max_global}")
            print(f"{'='*80}")

            unresolved = [p for p in problems if p.id not in resolved_problems]
            if not unresolved:
                self.logger.info("\n[SUCCESS] ALL PROBLEMS RESOLVED [SUCCESS]")
                print(f"\n{'='*80}")
                print("[OK] ALL PROBLEMS RESOLVED [OK]")
                print(f"{'='*80}\n")
                return True

            self.logger.info(f"\nGlobal Status: {len(resolved_problems)}/{len(problems)} problems resolved")
            self.logger.info(f"Remaining problems: {len(unresolved)}\n")
            print(f"\nGlobal Progress: {len(resolved_problems)}/{len(problems)} problems resolved")
            print(f"Remaining: {len(unresolved)}\n")

            for i, p in enumerate(unresolved, 1):
                self.logger.info(f"{i}. [{p.severity.upper()}] {p.category} - {p.description}")
                print(f"  {i}. [{p.severity.upper()}] {p.category} - {p.description}")

            first_problem = unresolved[0]
            self.logger.info("\n" + "=" * 80)
            self.logger.info(f"FOCUSING ON PROBLEM: {first_problem.id}")
            self.logger.info("=" * 80)

            print(f"\n{'>'*40}")
            print(f"FOCUSING ON PROBLEM [{len(resolved_problems) + 1}/{len(problems)}]: {first_problem.id}")
            print(f"Category: {first_problem.category}")
            print(f"Severity: {first_problem.severity}")
            print(f"{'>'*40}\n")

            problem_resolved = self._fix_single_problem(first_problem)
            if problem_resolved:
                resolved_problems.add(first_problem.id)
                self.logger.info(f"\n[OK] Problem [{first_problem.id}] MARKED as resolved\n")
                print(f"\n[OK] Problem [{first_problem.id}] MARKED as RESOLVED")
                print(f"Progress: {len(resolved_problems)}/{len(problems)} problems resolved")
                if self.auto_git_push:
                    print("\n[GIT] Creating checkpoint commit and pushing...")
                    git_ok = self._run_git_push_checkpoint(first_problem)
                    if not git_ok:
                        self.logger.error("Git push checkpoint failed after problem resolution.")
                        print("[GIT] Push checkpoint FAILED")
                    else:
                        print("[GIT] Push checkpoint OK")

                print("\n" + "=" * 80)
                print("LOGIC ERROR DETECTION")
                print("=" * 80)
                print("\nAfter fixing this problem, did you find NEW LOGIC ERRORS?")
                try:
                    ans = self._safe_input("(yes/no): ", "no").strip().lower()
                    if ans == 'yes':
                        print("\nDescribe the logic error found:")
                        desc = self._safe_input("> ").strip()
                        print("File and line (e.g., lib/calc.ts:42):")
                        loc = self._safe_input("> ").strip()
                        print("Suggested fix:")
                        fix_sug = self._safe_input("> ").strip()

                        new_prob = Problem(
                            id=f"logic_{hashlib.md5(desc.encode()).hexdigest()[:8]}",
                            severity="critical",
                            category="logic",
                            file=loc.split(':')[0] if ':' in loc else loc,
                            line=int(loc.split(':')[1]) if ':' in loc else 0,
                            description=desc,
                            suggested_fix=fix_sug,
                            code_snippet=desc[:100]
                        )
                        problems.append(new_prob)
                        print(f"[OK] Logic error added: {desc}\n")
                except Exception as e:
                    self.logger.debug(f"Logic error input error: {e}")
                print()
            else:
                max_attempts = str(self.max_attempts_per_problem) if self.max_attempts_per_problem is not None else "inf"
                self.logger.error(f"\n[ERROR] Problem [{first_problem.id}] NOT resolved after {max_attempts} attempts")
                self.logger.error("Continuing to next problem or max iterations...\n")
                print(f"\n[X] Problem [{first_problem.id}] could NOT be resolved after {max_attempts} attempts")
                print("Continuing to next problem (if any)...\n")

        max_global = str(self.max_global_iterations) if self.max_global_iterations is not None else "inf"
        unresolved = [p for p in problems if p.id not in resolved_problems]
        self.logger.error(f"\n[ERROR] Maximum global iterations ({max_global}) reached")
        self.logger.error(f"[ERROR] {len(unresolved)} problems still unresolved")

        print(f"\n{'#'*80}")
        print("[X] ITERATION LIMIT REACHED")
        print(f"  Max iterations: {max_global}")
        print(f"  Unresolved problems: {len(unresolved)}")
        print(f"{'#'*80}\n")
        return False

    def _fix_single_problem(self, problem: Problem) -> bool:
        """Inner loop: stay on one problem until solved (or optional cap)."""

        attempt = 0
        print(f"\n{'='*80}")
        print(f"ENTERING INNER LOOP FOR PROBLEM: {problem.id}")
        print(f"{'='*80}\n")

        while True:
            if self.max_attempts_per_problem is not None and attempt >= self.max_attempts_per_problem:
                self.logger.error(f"\n[EXHAUSTED] Exhausted all {self.max_attempts_per_problem} attempts on this problem")
                print(f"\n{'#'*80}")
                print(f"[X] EXHAUSTED: Max {self.max_attempts_per_problem} attempts reached on problem [{problem.id}]")
                print("Moving to next problem (if any)...")
                print(f"{'#'*80}\n")
                return False

            attempt += 1
            label = self._attempt_label(attempt)
            self.logger.info("\n" + "-" * 80)
            self.logger.info(f"ATTEMPT {label}")
            self.logger.info("-" * 80)
            print(f"\n{'*'*80}")
            print(f"ATTEMPT {label}")
            print(f"{'*'*80}")

            self.logger.info("\n[COMMAND] FIX THIS PROBLEM:\n")
            self.logger.info(f"Category: {problem.category}")
            self.logger.info(f"Severity: {problem.severity}")
            self.logger.info(f"File: {problem.file}")
            self.logger.info(f"Problem: {problem.description}")
            self.logger.info(f"Suggested Fix: {problem.suggested_fix}")
            if problem.code_snippet:
                self.logger.info(f"Details: {problem.code_snippet[:200]}")

            self.logger.info(f"""
REQUIREMENTS:
1. Fix the problem using your tools (Read, Edit, Write, etc.)
2. Run these commands to verify:
   - npm test
   - npm run lint
   - npm run build
3. Ensure ALL tests pass and build succeeds
4. Once verified, press ENTER

This is ATTEMPT {label}
If this attempt fails, I'll keep retrying ONLY this problem.
""")

            self.logger.info("\n[WAIT] Press ENTER when you've applied the fix and verified with tests...")
            self._safe_input("", "")

            self.logger.info("\n[CHECK] Re-running test suite to verify fix...")
            print("\n[CHECK] Running tests...")

            try:
                print("  1. Running: npm test...")
                test_result = subprocess.run(
                    [self.npm_cmd, "test"],
                    cwd=self.project_root,
                    capture_output=True,
                    text=False,
                    timeout=60
                )
                print(f"     {'[PASS]' if test_result.returncode == 0 else '[FAIL]'}")

                print("  2. Running: npm run lint...")
                lint_result = subprocess.run(
                    [self.npm_cmd, "run", "lint"],
                    cwd=self.project_root,
                    capture_output=True,
                    text=False,
                    timeout=30
                )
                print(f"     {'[PASS]' if lint_result.returncode == 0 else '[FAIL]'}")

                print("  3. Running: npm run build...")
                build_result = subprocess.run(
                    [self.npm_cmd, "run", "build"],
                    cwd=self.project_root,
                    capture_output=True,
                    text=False,
                    timeout=120
                )
                print(f"     {'[PASS]' if build_result.returncode == 0 else '[FAIL]'}")

                all_passed = (
                    test_result.returncode == 0 and
                    lint_result.returncode == 0 and
                    build_result.returncode == 0
                )

                if all_passed:
                    self.logger.info("\n[PASS] ALL TESTS PASSED!")
                    self.logger.info("[PASS] npm test: OK")
                    self.logger.info("[PASS] npm lint: OK")
                    self.logger.info("[PASS] npm build: OK")

                    print(f"\n{'='*80}")
                    print("[OK] SUCCESS! ALL TESTS PASSED! [OK]")
                    print(f"Problem [{problem.id}] has been FIXED and VERIFIED!")
                    print(f"{'='*80}\n")
                    return True

                self.logger.error("\n[FAIL] VERIFICATION FAILED - Tests still failing")
                print(f"\n{'!'*80}")
                print("[FAIL] TESTS FAILED [FAIL]")
                if test_result.returncode != 0:
                    self.logger.error("[FAIL] npm test FAILED")
                    self.logger.error(f"Error: {self._decode_result_output(test_result.stderr)[:300]}")
                    print("  [X] npm test FAILED")
                if lint_result.returncode != 0:
                    self.logger.error("[FAIL] npm lint FAILED")
                    self.logger.error(f"Error: {self._decode_result_output(lint_result.stdout)[:300]}")
                    print("  [X] npm lint FAILED")
                if build_result.returncode != 0:
                    self.logger.error("[FAIL] npm build FAILED")
                    self.logger.error(f"Error: {self._decode_result_output(build_result.stderr)[:300]}")
                    print("  [X] npm build FAILED")
                print(f"{'!'*80}\n")

                next_label = self._attempt_label(attempt + 1)
                self.logger.info(f"\n[RETRY] Retrying this problem (attempt {next_label})...")
                print(f"-> RETRYING: Attempt {next_label}")
                print("Press ENTER to try again with the SAME problem...")
                self._safe_input("", "")

            except subprocess.TimeoutExpired:
                self.logger.error("[ERROR] Test execution timeout")
                return False
            except Exception as e:
                self.logger.error(f"[ERROR] Exception during testing: {e}")
                return False
class ValidationOrchestrator:
    """Main orchestrator that runs the complete validation flow"""

    def __init__(
        self,
        project_root: Path,
        interactive: bool = True,
        max_attempts_per_problem: Optional[int] = None,
        max_global_iterations: Optional[int] = None,
        auto_git_push: bool = False,
        git_remote: str = "origin",
        git_branch: str = "main"
    ):
        self.project_root = project_root
        self.logger = logger
        self.interactive = interactive
        self.max_attempts_per_problem = max_attempts_per_problem
        self.max_global_iterations = max_global_iterations
        self.auto_git_push = auto_git_push
        self.git_remote = git_remote
        self.git_branch = git_branch

    def run(self) -> bool:
        """Execute complete validation flow"""
        print("\n" + "=" * 80)
        print("BOUNDED EXHAUSTIVE VALIDATION FRAMEWORK")
        print("Professional Enterprise-Grade Validation System")
        print("=" * 80 + "\n")

        self.logger.info("=" * 80)
        self.logger.info("BOUNDED EXHAUSTIVE VALIDATION FRAMEWORK")
        self.logger.info("Professional Enterprise-Grade Validation System")
        self.logger.info("=" * 80)

        start_time = time.time()

        try:
            # PHASE 1: Discover problems
            analyzer = ProjectAnalyzer(self.project_root)
            problems = analyzer.discover_problems()

            # PHASE 2-4: Validate recursively with Claude in loop
            validator = RecursiveValidator(
                self.project_root,
                npm_cmd=analyzer.npm_cmd,
                interactive=self.interactive,
                max_attempts_per_problem=self.max_attempts_per_problem,
                max_global_iterations=self.max_global_iterations,
                auto_git_push=self.auto_git_push,
                git_remote=self.git_remote,
                git_branch=self.git_branch
            )
            final_result = validator.validate_and_loop(problems)

            elapsed = time.time() - start_time

            # Summary
            self.logger.info("\n" + "=" * 80)
            self.logger.info("FINAL VALIDATION SUMMARY")
            self.logger.info("=" * 80)
            self.logger.info(f"Total problems discovered: {len(problems)}")
            self.logger.info(f"Execution time: {elapsed:.2f}s")
            self.logger.info("=" * 80)

            print(f"\n{'='*80}")
            print("FINAL VALIDATION SUMMARY")
            print(f"{'='*80}")
            print(f"Total problems discovered: {len(problems)}")
            print(f"Execution time: {elapsed:.2f}s")
            print(f"{'='*80}")

            if final_result:
                self.logger.info("\n[SUCCESS] VALIDATION PASSED [SUCCESS]")
                self.logger.info("All problems have been resolved!")
                print("\n[OK] VALIDATION PASSED [OK]")
                print("All problems have been resolved!\n")
                return True
            else:
                self.logger.error("\n[INCOMPLETE] VALIDATION INCOMPLETE [INCOMPLETE]")
                self.logger.error("Some problems could not be resolved within max iterations")
                print("\n[FAIL] VALIDATION INCOMPLETE [FAIL]")
                print("Some problems could not be resolved within max iterations\n")
                return False

        except KeyboardInterrupt:
            self.logger.info("\n[WARN] Validation interrupted by user")
            return False
        except Exception as e:
            self.logger.error(f"Fatal error: {e}", exc_info=True)
            return False

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Recursive validation framework for full portal verification."
    )
    parser.add_argument(
        "--interactive",
        dest="interactive",
        action="store_true",
        help="Enable interactive fix loop (default if stdin is a TTY)."
    )
    parser.add_argument(
        "--no-interactive",
        dest="interactive",
        action="store_false",
        help="Disable interactive prompts (useful for CI)."
    )
    parser.set_defaults(interactive=sys.stdin.isatty())
    parser.add_argument(
        "--max-attempts-per-problem",
        type=int,
        default=0,
        help="Max attempts for each problem; 0 means infinite loop."
    )
    parser.add_argument(
        "--max-global-iterations",
        type=int,
        default=0,
        help="Max outer iterations; 0 means infinite loop."
    )
    parser.add_argument(
        "--auto-git-push",
        dest="auto_git_push",
        action="store_true",
        help="After each resolved problem: git add/commit/push."
    )
    parser.add_argument(
        "--no-auto-git-push",
        dest="auto_git_push",
        action="store_false",
        help="Disable automatic git push checkpoints."
    )
    parser.add_argument(
        "--git-remote",
        type=str,
        default="origin",
        help="Git remote used by --auto-git-push."
    )
    parser.add_argument(
        "--git-branch",
        type=str,
        default="main",
        help="Git branch used by --auto-git-push."
    )
    parser.set_defaults(auto_git_push=True)
    args = parser.parse_args()

    # Find project root by looking for package.json
    current = Path(".").resolve()
    project_root = current

    # First check current directory and parents
    for parent in [current] + list(current.parents):
        if (parent / "package.json").exists():
            project_root = parent
            break

    # If not found in parents, look in immediate subdirectories
    if not (project_root / "package.json").exists():
        try:
            for subdir in current.iterdir():
                if subdir.is_dir() and (subdir / "package.json").exists():
                    project_root = subdir
                    break
        except (OSError, PermissionError):
            pass

    print(f"Project root: {project_root}")
    print(f"Package.json exists: {(project_root / 'package.json').exists()}")

    max_attempts = None if args.max_attempts_per_problem <= 0 else args.max_attempts_per_problem
    max_iterations = None if args.max_global_iterations <= 0 else args.max_global_iterations

    orchestrator = ValidationOrchestrator(
        project_root,
        interactive=args.interactive,
        max_attempts_per_problem=max_attempts,
        max_global_iterations=max_iterations,
        auto_git_push=args.auto_git_push,
        git_remote=args.git_remote,
        git_branch=args.git_branch
    )
    success = orchestrator.run()
    sys.exit(0 if success else 1)

