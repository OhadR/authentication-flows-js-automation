@api
Feature: Authentication Flows API

    Background: login
#        Given user log-in with username and password of environment

    Scenario Outline: Create Account
        When create account with username <username> password <password> retyped password <repassword> is called
        Then return status <status> and return message <returnMessage>
        Examples:
            | username | password    | repassword   | status | returnMessage    |
            | not_mail | pass        | pass         | 500    | null             |
            | a@b.com  | pass        | other_pass   | 500    | null             |
            | a@b.com  | pass        | pass         | 200    | null             |

