# automation-cucumber.js

## Install

[see here](https://github.com/OhadR/automation-cucumber.js).


## Environment Variables

to allow debug [(what is this `follow-redirects`?)](#follow-redirects):

    set DEBUG=*,-follow-redirects
    
## Run

    npm test

----

## Challenges

### Optional Parameter in Step

I would like to have a single implementation for:

    Given update metadata of asset for test <testName> in elastic

and:
        
    Given update metadata of asset after tiling for test <testName> in elastic 
        
it is done this way:

    @given(/update metadata of asset (after tiling )?for test (.*) in elastic/)
    public async updateAssetInElastic(isAfterTiling: boolean, testName: string) {       
        ....
        const fileName = isAfterTiling? somethingA : somethingB;
    }
    
    
