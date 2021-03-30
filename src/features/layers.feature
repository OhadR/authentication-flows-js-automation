@api @layers
Feature: Layers API

    Background: login
#        Given user log-in with username and password of environment

@ohads
    Scenario Outline: Simple Get Layers
        When create account is called
        Then layers exist for test <testName> and dataTypes <dataTypes>
        Examples:
            | testName | dataTypes               |
            | LASer    | POINT_CLOUD             |
            | GeoTIFF  | ORTHOMOSAIC             |
            | GeoJSON  | GEOJSON                 |
            | 3DMESH   | 3DMESH,POINT_CLOUD      |

    Scenario Outline: Update a Layer
        Given update metadata of asset after tiling for test <testName> in elastic
        When get layers is called
        Then layers exist for test <testName> and dataTypes <dataType>
        When update layer for test <testName> and dataTypes <dataType> for key <key> to value <newValue> is called and return status <updateStatus> and return message <returnMessage>
        And get layers is called
        # validate layer exists BY ID:
        Then layers exist for test <testName> and dataTypes <dataType>
        # validate new value is updated for layer:
        Then layers with key <key> and value <newValue> exist for test <testName> and dataTypes <dataType>
        Examples:
            | testName | dataType    | key          | newValue        | updateStatus | returnMessage |
            | LASer    | POINT_CLOUD | datasetName  | automationLayer | 200          | updated       |
            | LASer    | POINT_CLOUD | supplierName | newSupplierName | 200          | updated       |



    Scenario Outline: Update a PREMIUM Layer - change supplierName
        Given update metadata of asset after tiling for test <testName> in elastic
        Given set asset for test <testName> in elastic to be PREMIUM
        When update layer for test <testName> and dataTypes <dataType> for key <key> to value <newValue> is called and return status <updateStatus> and return message <returnMessage>
        Examples:
            | testName | dataType    | key          | newValue        | updateStatus | returnMessage    |
            | LASer    | POINT_CLOUD | supplierName | newSupplierName | 401          | asset is PREMIUM |



    Scenario Outline: Delete a Layer
        Given update metadata of asset after tiling for test <testName> in elastic
        When get layers is called
        Then layers exist for test <testName> and dataTypes <dataType>
        When delete layer for test <testName> and dataTypes <dataType> is called
        And get layers is called
        #validate layer DOES NOT exists:
        Then layer not exist for test <testName> and dataType <dataType>
        Examples:
            | testName | dataType    |
            | LASer    | POINT_CLOUD |


    Scenario Outline: Delete a Layer that was part of workspace
        Given update metadata of asset after tiling for test <testName> in elastic
        When create workspace is called
        And add layer with id <layerId> to workspace
        Then layer with id <layerId> is added to workspace
        # calls deleteLayers():
        When delete layer with id <layerId> is called
        # validate the return value:
        Then return value of delete Layer was the workspaceId
        Then layer with id <layerId> not exist in workspace
        Examples:
            | testName | layerId                   |
            | LASer    | fakeLayer.ast-POINT_CLOUD |
