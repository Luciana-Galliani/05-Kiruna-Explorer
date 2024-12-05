# Technical Debt Strategy

## Introduction

This document outlines the strategy for managing technical debt in the project using SonarCloud and automatic analysis tools.

## Tools

-   **SonarCloud**: A cloud-based code quality and security service.

## Objectives

-   Identify and manage technical debt.
-   Ensure code quality and security (manteinibility, reliability and code duplication).
-   Automate the detection of code issues.

## Strategy

### 1. Integration with SonarCloud

-   **Organizations**: Create a GH organization that are used for share the code in the group.
-   **Setup**: Integrate the project repository with SonarCloud.
-   **Configuration**: Configure SonarCloud to analyze the codebase.

### 2. Automatic Analysis

-   **Triggers**: Set up automatic analysis to run on every pull request, and main commits.
-   **Reports**: Generate and review reports for each analysis.

### 3. Managing Technical Debt

-   **Debt Ratio**: Monitor the technical debt ratio provided by SonarCloud.
-   **Prioritization**: Prioritize issues based on severity and impact.
-   **Action Plan**: Develop an action plan to address high-priority issues. All the team members should work for minimizing technical debt, and are responsible for the issues on the code they write : if an issue with high severity is detected by sonar or security hotspot, the author should try to fix it as soon as possible (possibly asking for help from the teammates if needed).

### 4. Code Quality Gates

-   **Enforcement**: Ensure that code changes meet quality gate criteria before merging.
-   **Pull request**: Never merge a pull request with high severity problem.

## Reporting

-   **Dashboard**: Use SonarCloud dashboards to monitor code quality and technical debt.
-   **Notifications**: Set up notifications for critical issues and debt accumulation.
-   **Regular Reviews**: Conduct regular (every pull request) reviews of technical debt and code quality reports.

## Conclusion

By integrating SonarCloud and automating code analysis, we can effectively manage technical debt, maintain high code quality, and ensure the long-term maintainability of the project.
