# RETROSPECTIVE 3 (Team #5)

The retrospective should include _at least_ the following
sections:

-   [process measures](#process-measures)
-   [quality measures](#quality-measures)
-   [general assessment](#assessment)

## PROCESS MEASURES

### Macro statistics

-   Number of stories committed vs. done : 3 vs 3
-   Total points committed vs. done : 18 vs 18
-   Nr of hours planned vs. spent (as a team) : 66h vs 67h15m

**Remember** a story is done ONLY if it fits the Definition of Done:

-   Unit Tests passing
-   Code review completed
-   Code present on VCS
-   End-to-End tests performed

> Please refine your DoD if required (you cannot remove items!)

### Detailed statistics

| Story | # Tasks | Points | Hours est. | Hours actual |
| ----- | ------- | ------ | ---------- | ------------ |
| _#0_  | 16      |        | 40h        | ?            |
| 8     | 4       | 5      | 8h         | 8h           |
| 9     | 7       | 8      | ?          | ?            |
| 19    | 4       | 5      | ?          | ?            |

> story `#0` is for technical tasks, leave out story points (not applicable in this case)

-   Hours per task average, standard deviation (estimate and actual)

    ESTIMATE: -- ACTUAL:

-   Total estimation error ratio: sum of total hours spent / sum of total hours effort - 1

    $$\frac{\sum_i spent_{task_i}}{\sum_i estimation_{task_i}} - 1$$
    VALUE: %

-   Absolute relative task estimation error: sum( abs( spent-task-i / estimation-task-i - 1))/n

    $$\frac{1}{n}\sum_i^n \left| \frac{spent_{task_i}}{estimation_task_i}-1 \right| $$
    VALUE: %

## QUALITY MEASURES

-   Unit Testing:
    -   Total hours estimated :
    -   Total hours spent :
    -   Nr of automated unit test cases :
    -   Coverage (if available) : 100% of the tested files (controllers, DAOs, middlewares and utils functions) Only on the backend
-   E2E testing:
    -   Total hours estimated :
    -   Total hours spent :
-   Code review
    -   Total hours estimated :
    -   Total hours spent :

## ASSESSMENT

-   What caused your errors in estimation (if any)?

    -   Map component became too big and we didn't simplify it before adding new features.
    -   Form component refactoring and style changes took more time than expected

-   What lessons did you learn (both positive and negative) in this sprint?

    -   Negative aspect: Too much work and stories commited, on top of TD and feedbacks
    -   Positive aspect: Organization of the branches was way better, no merge conflicts

-   Which improvement goals set in the previous retrospective were you able to achieve?

    -   Organization of the blocking tasks was good, everybody could work on their task without waiting for someone else

-   Which ones you were not able to achieve? Why?

    -   Time management : 2 people have more than 16h

-   Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

    -   Dont underestimate the amount of time the tasks and feedbacks to avoid overload of work
    -   Dont let a component/file get too big, otherwise refactors are heavy tasks

-   One thing you are proud of as a Team!!
    -   Technical debt was well managed, no security hotspots left, not much duplication, and remaining issues are not with high severity level
