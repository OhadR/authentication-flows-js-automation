@api
Feature: Authentication Flows API

    Background: login
#        Given user log-in with username and password of environment

    Scenario Outline: Create Account
        When create account with username <username> password <password> retyped password <repassword> is called
        Then return status <status> and return message <returnMessage>
        Examples:
            | username                | password    | repassword   | status | returnMessage                              |
            | not_mail                | pass        | pass         | 500    | The e-mail you have entered is not valid   |
            | bmc.incubator@gmail.com | pass        | other_pass   | 500    | These passwords don't match                |
            | bmc.incubator@gmail.com | pass        | pass         | 200    | null                                       |

    @ohads
    Scenario Outline: Activate Account
        When create account with username <username> password <password> retyped password <repassword> is called
        Then return status 200 and return message OK
#       make sure login fails before activation:
        When login with username <username> password <password> is called
        Then return status 401 and return message login failed

        When get activation link for username <username> is called
        When activate account for username <username> is called
        Then return status 200 and return message OK
#       make sure login ok after activation:
        When login with username <username> password <password> is called
        Then return status 200 and return message OK

#        make sure the link is valid only once:
        When activate account for username <username> is called
        Then return status 500 and return message link does not exist in DB
        Examples:
            | username                 | password    | repassword   |
            | bmc.incubator@gmail.com  | pass        | pass         |
