# RETROSPECTIVE 4 (Team 5)

The retrospective should include _at least_ the following
sections:

-   [process measures](#process-measures)
-   [quality measures](#quality-measures)
-   [general assessment](#assessment)

## PROCESS MEASURES

### Macro statistics

-   Number of stories committed vs done
-   Total points committed vs done
-   Nr of hours planned vs spent (as a team)

**Remember** a story is done ONLY if it fits the Definition of Done:

-   Unit Tests passing
-   Code review completed
-   Code present on VCS
-   End-to-End tests performed

> Please refine your DoD

### Detailed statistics

| Story | # Tasks | Points | Hours est. | Hours actual |
| ----- | ------- | ------ | ---------- | ------------ |
| _#0_  |         | -      |            |              |
| n     |         |        |            |              |

> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

-   Hours per task average, standard deviation (estimate and actual)

|            | Mean | StDev |
| ---------- | ---- | ----- |
| Estimation |      |       |
| Actual     |      |       |

-   Total estimation error ratio: sum of total hours spent / sum of total hours effort - 1

    $$\frac{\sum_i spent_{task_i}}{\sum_i estimation_{task_i}} - 1$$

-   Absolute relative task estimation error: sum( abs( spent-task-i / estimation-task-i - 1))/n

    $$\frac{1}{n}\sum_i^n \left| \frac{spent_{task_i}}{estimation_task_i}-1 \right| $$

## QUALITY MEASURES

-   Unit Testing:
    -   Total hours estimated : 0h (no backend task on this sprint so no new unit tests)
    -   Total hours spent : 0h
    -   Nr of automated unit test cases : 73
    -   Coverage : 100% of the tested files (controllers, DAOs, middlewares and utils functions) Only on the backend
-   E2E testing:
    -   Total hours estimated : 5h
    -   Total hours spent : 5h 15m
    -   Nr of test cases : 68
-   Code review
    -   Total hours estimated : 3h
    -   Total hours spent : 3h
-   Technical Debt management: -> too much duplications on this sprint but only in svg (icons) and test files so we cant really diminish it
    -   Strategy adopted : same as last sprint : - High severity issues and and security hotspots are priority - All the team members should work for minimizing technical debt, and are responsible for the issues on the code they write : if an issue with high severity is detected by sonar or security hotspot, the author should try to fix it as soon as possible (possibly asking for help from the teammates if needed). - Analysis conducted on pull requests and main commits
    -   Total hours estimated at sprint planning : 3h30
    -   Total hours spent : 3h

## ASSESSMENT

-   What caused your errors in estimation (if any)?

-   What lessons did you learn (both positive and negative) in this sprint?

    -   More scrum meetings in this sprint, helped for organization

-   Which improvement goals set in the previous retrospective were you able to achieve?
    -   The time and work quantity was way better : everybody was under 17h, no last minute rush to finish the last stories
    -   Refactors were well managed and others components kept a good size, easy to work with
-   Which ones you were not able to achieve? Why?

    -   achieved all of the goals

-   Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

-   One thing you are proud of as a Team!!
    -   Very proud of the application we produced
    -   We improved the team organization and coordination a lot : no problems in the last sprints
