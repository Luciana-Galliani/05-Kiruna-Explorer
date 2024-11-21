# TEMPLATE FOR RETROSPECTIVE (Team #5)

The retrospective should include _at least_ the following
sections:

-   [process measures](#process-measures)
-   [quality measures](#quality-measures)
-   [general assessment](#assessment)

## PROCESS MEASURES

### Macro statistics

-   Number of stories committed vs. done : 4 vs 4
-   Total points committed vs. done : 14 vs 14
-   Nr of hours planned vs. spent (as a team) : 62h45m vs 64h30m

**Remember** a story is done ONLY if it fits the Definition of Done:

-   Unit Tests passing
-   Code review completed
-   Code present on VCS
-   End-to-End tests performed

> Please refine your DoD if required (you cannot remove items!)

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_   |   17    |        |   30h45m   |    30h15m    |
| 4      |   6     |   5    |   10h30m   |    11h00m    |
| 5      |   5     |   3    |   06h00m   |    7h30m     |
| 6      |   4     |   7    |   04h30m   |    4h30m     |
| 7      |   9     |   7    |   11h00m   |    11h15m    |


> story `#0` is for technical tasks, leave out story points (not applicable in this case)

-   Hours per task average, standard deviation (estimate and actual)

    ESTIMATE: 6.23  -- ACTUAL: 6.27 //to do

-   Total estimation error ratio: sum of total hours spent / sum of total hours effort - 1

    $$\frac{\sum_i spent_{task_i}}{\sum_i estimation_{task_i}} - 1$$
    VALUE: 2.7%

-   Absolute relative task estimation error: sum( abs( spent-task-i / estimation-task-i - 1))/n

    $$\frac{1}{n}\sum_i^n \left| \frac{spent_{task_i}}{estimation_task_i}-1 \right| $$
    VALUE: 0.74% //to do

## QUALITY MEASURES

-   Unit Testing:
    -   Total hours estimated : 1h45m
    -   Total hours spent : 1h45m
    -   Nr of automated unit test cases : 53
    -   Coverage (if available) : 100% of the tested files (controllers, DAOs and middlewares)
-   E2E testing:
    -   Total hours estimated :3h30m
    -   Total hours spent : 3h30m
-   Code review
    -   Total hours estimated : 1h45m
    -   Total hours spent : 1h45m

## ASSESSMENT

-   What caused your errors in estimation (if any)?

    -   The form component become too big and we work on it we loose some time

-   What lessons did you learn (both positive and negative) in this sprint?

    -   Negative aspect: github organisation could be improved
    -   Positive aspect: well completed all the stories we were expected to do

-   Which improvement goals set in the previous retrospective were you able to achieve?
    -   We have more equality in the hours for each person
    -   We did more scrum meetings

-   Which ones you were not able to achieve? Why?

    -   Better identify the blocking tasks and don't assign them to someone who cannot work on the begginning of the sprint : otherwise, the others are stuck waiting
    -> we had better task assignmemt, the people could work but some tasks took more time than expected so we still had people waiting for tasks to finish 


-   Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
    - When facing an issue and working on a blocking task, need to improve commumication of the problem, and assign people to help solving the issue instead of waiting
    - On github, try to do more branches of smaller size to facilitate code review and problem solving
    -> at least one branch per story

-   One thing you are proud of as a Team!!
    -   Proud of the 4 US done working nicely
