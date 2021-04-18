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
            | bmc.incubator@gmail.com | Passw0rd!   | other_pass   | 500    | These passwords don't match                |
            | bmc.incubator@gmail.com | Passw0rd!   | Passw0rd!    | 200    | OK                                       |


    # test account activation, and test that link is valid only once
    Scenario Outline: Activate Account
        When create account with username <username> password <password> retyped password <repassword> is called
        Then return status 200 and return message OK
#       make sure login fails before activation:
        When login with username <username> password <password> is called
        Then return status 401 and return message authentication failed

        When get link for username <username> is called
        When activate account with link is called
        Then return status 200 and return message OK
#       make sure login ok after activation:
        When login with username <username> password <password> is called
        Then return status 200 and return message OK

#        make sure the link is valid only once:
        When activate account with link is called
        Then return status 500 and return message Could not find any user with this link.
        Examples:
            | username                 | password    | repassword   |
            | bmc.incubator@gmail.com  | Passw0rd!   | Passw0rd!    |



    Scenario Outline: Account Lock (due to login-failure)
        When create account with username <username> password <password> retyped password <password> is called
        Then return status 200 and return message OK
        When get link for username <username> is called
        When activate account with link is called
        Then return status 200 and return message OK
#        bad login till account is locked:
        When login with username <username> password bad-password is called
        Then return status 401 and return message authentication failed
        When login with username <username> password bad-password is called
        Then return status 401 and return message authentication failed
        When login with username <username> password bad-password is called
        Then return status 401 and return message authentication failed
        When login with username <username> password bad-password is called
        Then return status 401 and return message authentication failed
        When login with username <username> password bad-password is called
        Then return status 401 and return message authentication failed
        # on the 5th attempt the account is getting locked:
        When login with username <username> password bad-password is called
        Then return status 423 and return message Account has been locked out for user: bmc.incubator@gmail.com due to exceeding number of attempts to login.
        # next time, we get 401 again:
        When login with username <username> password bad-password is called
        Then return status 401 and return message authentication failed
        # test unlock URL (similar to activation url)
        When get link for username <username> is called
        When activate account with link is called
        Then return status 200 and return message OK
    Examples:
            | username                 | password    |
            | bmc.incubator@gmail.com  | Passw0rd!   |


    # test few login failured, then success, and make sure counter of attempts resets.
    Scenario Outline: Successful Login Reset Number Attempts Left
        When create account with username <username> password <password> retyped password <password> is called
        Then return status 200 and return message OK
        When get link for username <username> is called
        When activate account with link is called
        Then return status 200 and return message OK
#        bad login till account is locked:
        When login with username <username> password bad-password is called
        Then return status 401 and return message authentication failed
        When login with username <username> password bad-password is called
        Then return status 401 and return message authentication failed
        When login with username <username> password bad-password is called
        Then return status 401 and return message authentication failed
        When login with username <username> password bad-password is called
        Then return status 401 and return message authentication failed
        When login with username <username> password <password> is called
        Then return status 200 and return message OK
        When login with username <username> password bad-password is called
        Then return status 401 and return message authentication failed
        When login with username <username> password bad-password is called
        Then return status 401 and return message authentication failed
        When login with username <username> password bad-password is called
        Then return status 401 and return message authentication failed
        When login with username <username> password bad-password is called
        Then return status 401 and return message authentication failed
        When login with username <username> password bad-password is called
        Then return status 401 and return message authentication failed
        When login with username <username> password bad-password is called
        Then return status 423 and return message Account has been locked out for user: bmc.incubator@gmail.com due to exceeding number of attempts to login.
        Examples:
            | username                 | password    |
            | bmc.incubator@gmail.com  | Passw0rd!   |

    Scenario Outline: Forgot Password
        When create account with username <username> password <password> retyped password <password> is called
        Then return status 200 and return message OK
        When get link for username <username> is called
        When activate account with link is called
        Then return status 200 and return message OK
        #        forgot-password:
        When forgot password for username <username> is called
        Then return status 200 and return message OK
        When get link for username <username> is called
        When reset password with link is called
        Then return status 200 and return message OK
        # user is directed to set new password page, enters his new password and now we test the server
        When set new password with password <newPassword> retyped password <newPassword> is called
        Then return status 200 and return message OK
        # validate link is valid only once:
        When reset password with link is called
        Then return status 500 and return message Could not find any user with this link.

        #       make sure login ok after change password:
        When login with username <username> password <newPassword> is called
        Then return status 200 and return message OK
        Examples:
            | username                 | password    | newPassword |
            | bmc.incubator@gmail.com  | Passw0rd!   | newpass     |



    Scenario Outline: Forgot Password to non-activated account
        When create account with username <username> password <password> retyped password <password> is called
        Then return status 200 and return message OK
        #  forgot-password:
        When forgot password for username <username> is called
        Then return status 500 and return message Account is locked or does not exist
        Examples:
            | username                 | password    |
            | bmc.incubator@gmail.com  | Passw0rd!   |


    Scenario Outline: Password Policy
        When create account with username <username> password <password> retyped password <password> is called
        Then return status 500 and return message <returnMessage>
        Examples:
            | username                | password    | returnMessage                              |
            | bmc.incubator@gmail.com | pass        | too short                                  |
            | bmc.incubator@gmail.com | Passw0rd    | These passwords don't match                |

#test wrong links