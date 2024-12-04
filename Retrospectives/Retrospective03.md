# RETROSPECTIVE 3 (Team #5)

The retrospective should include _at least_ the following
sections:

-   [process measures](#process-measures)
-   [quality measures](#quality-measures)
-   [general assessment](#assessment)

## PROCESS MEASURES

### Macro statistics

-   Number of stories committed vs. done : 3 vs ?
-   Total points committed vs. done : 18 vs ?
-   Nr of hours planned vs. spent (as a team) : 64h vs ?

**Remember** a story is done ONLY if it fits the Definition of Done:

-   Unit Tests passing
-   Code review completed
-   Code present on VCS
-   End-to-End tests performed

> Please refine your DoD if required (you cannot remove items!)

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_   |   16    |        |   40h      |    ?    |
| 8      |   4     |   5    |    8h      |    8h    |
| 9      |   7     |   8    |   ?   |    ?     |
| 19     |   4     |   5    |   ?   |    ?     |


> story `#0` is for technical tasks, leave out story points (not applicable in this case)

-   Hours per task average, standard deviation (estimate and actual)

    ESTIMATE:   -- ACTUAL: 

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

    -   The form component became too big and when we work on it we loose some time

-   What lessons did you learn (both positive and negative) in this sprint?

    -   Negative aspect: github branches organisation could be improved
    -   Positive aspect: well completed all the stories we were expected to do

-   Which improvement goals set in the previous retrospective were you able to achieve?
    -   We have more equality in the hours for each person
    -   We did more scrum meetings and a middle sprint demo to show the progress of the different tasks

-   Which ones you were not able to achieve? Why?

    -   Better identify the blocking tasks and don't assign them to someone who cannot work on the begginning of the sprint : otherwise, the others are stuck waiting
    -> we had better task assignmemt, the people could work but some tasks took more time than expected so we still had people waiting for tasks to finish 


-   Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
    - When facing an unexpected issue and working on a blocking task, we need to improve commumication of the problem, and assign people to help solving the issue instead of waiting
    - On github, try to do more branches of smaller size to facilitate code review and problem solving
    -> at least one branch per story

-   One thing you are proud of as a Team!!
    -   Proud of the 4 US done working nicely
