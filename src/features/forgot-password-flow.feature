@api
Feature: Authentication Flows API


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
        When wait 3 seconds
        When reset password with link is called
        Then return status 500 and return message Could not find any user with this link.

        #       make sure login ok after change password:
        When login with username <username> password <newPassword> is called
        Then return status 200 and return message OK
        Examples:
            | username                 | password    | newPassword |
            | bmc.incubator@gmail.com  | Passw0rd!   | Pa22word!   |


    Scenario Outline: Forgot Password and Set Bad Password
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
        Then return status 500 and return message Setting a new password has failed. Please note the password policy and try again
        Examples:
            | username                 | password    | newPassword |
            | bmc.incubator@gmail.com  | Passw0rd!   | newpass     |


    Scenario Outline: Forgot Password to non-activated account
        When create account with username <username> password <password> retyped password <password> is called
        Then return status 200 and return message OK
        #  forgot-password should not show info about the account status, whether it exists or not. so expect 200:
        When forgot password for username <username> is called
        Then return status 200 and return message OK
        Examples:
            | username                 | password    |
            | bmc.incubator@gmail.com  | Passw0rd!   |


    Scenario: Use Wrong Link in Reset Password
        When set link for test to dummyCode
        When reset password with link is called
        Then return status 500 and return message Could not find any user with this link.
