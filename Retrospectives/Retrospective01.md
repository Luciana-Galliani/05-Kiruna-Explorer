# TEMPLATE FOR RETROSPECTIVE (Team #5)

The retrospective should include _at least_ the following
sections:

-   [process measures](#process-measures)
-   [quality measures](#quality-measures)
-   [general assessment](#assessment)

## PROCESS MEASURES

### Macro statistics

-   Number of stories committed vs. done : 3 vs 3
-   Total points committed vs. done : 15 vs 15
-   Nr of hours planned vs. spent (as a team) : 63h vs 63h05m

**Remember** a story is done ONLY if it fits the Definition of Done:

-   Unit Tests passing
-   Code review completed
-   Code present on VCS
-   End-to-End tests performed

> Please refine your DoD if required (you cannot remove items!)

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_   |   10    |        |   25h      |    24h15m    |
| 1      |   11    |   5    |   15h30m   |    16h30m    |
| 2      |   5     |   3    |   7h       |    7h30m     |
| 3      |   7     |   7    |   15h30m   |    14h20m    |

> story `#0` is for technical tasks, leave out story points (not applicable in this case)

-   Hours per task average, standard deviation (estimate and actual)

    ESTIMATE: 6.23  -- ACTUAL: 6.27

-   Total estimation error ratio: sum of total hours spent / sum of total hours effort - 1

    $$\frac{\sum_i spent_{task_i}}{\sum_i estimation_{task_i}} - 1$$
    VALUE: 0.66%

-   Absolute relative task estimation error: sum( abs( spent-task-i / estimation-task-i - 1))/n

    $$\frac{1}{n}\sum_i^n \left| \frac{spent_{task_i}}{estimation_task_i}-1 \right| $$
    VALUE: 0.74%

## QUALITY MEASURES

-   Unit Testing:
    -   Total hours estimated : 7h
    -   Total hours spent : 6h
    -   Nr of automated unit test cases : 45
    -   Coverage (if available) : 100% of the tested files (controllers, DAOs and middlewares)
-   E2E testing:
    -   Total hours estimated :4h30
    -   Total hours spent : 4h30
-   Code review
    -   Total hours estimated : 2h30
    -   Total hours spent : 2h30

## ASSESSMENT

-   What caused your errors in estimation (if any)?

    -   only 5 min

-   What lessons did you learn (both positive and negative) in this sprint?

    -   Negative aspect: need to divide better the hours between each other
    -   Positive aspect: well completed all the stories we were expected to do

-   Which improvement goals set in the previous retrospective were you able to achieve?
    -   We improved the organization and had more comunication between the members
    -   APIs specification and documentation was better, allowing less confusion between front and back-end
    -   Set up of the Unit tests well done
-   Which ones you were not able to achieve? Why?

    -   We coundn't do more scrum meetings, for the small amount of time we had in this two weeks. It was difficult to organize more meetings with everyone's personal schedule. We tried to compensate by doing a lot of updates on the group every time someone worked on the project

-   Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

    -   We need to have a better task assignment, based on the availability of the persons, and more equality in the hours selected.
    -   Better identify the blocking tasks and don't assign them to someone who cannot work on the begginning of the sprint : otherwise, the others are stuck waiting

-   One thing you are proud of as a Team!!
    -   Proud of the 3 US done working nicely
    -   Clean basic architecture set up for the next sprints
