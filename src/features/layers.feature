@api
Feature: Authentication Flows API

    Background: login
#        Given user log-in with username and password of environment

    Scenario Outline: Create Account
        When create account with username <username> password <password> retyped password <repassword> is called
        Then layers exist for test <testName> and dataTypes <dataTypes>
        Examples:
            | testName | dataType    | key          | newValue        | updateStatus | returnMessage |
            | LASer    | POINT_CLOUD | datasetName  | automationLayer | 200          | updated       |
            | LASer    | POINT_CLOUD | supplierName | newSupplierName | 200          | updated       |

