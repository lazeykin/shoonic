Branching:  

    master - `readonly`, relese, working and tested build  
    ├── frontend/dev - main dev branch, working and tested build for frontend part, `readonly`, no backend code  
    │   └── frontend/dev_* - feature or developer's branch, may contain non working code
    ├── backend/dev - main dev branch, working and tested build for backend part, `readonly`, no frontend code  
    │   └── backend/dev_* - feature or developer's branch, may contain non working code
    └── glue/dev_* - glue code 
    
If feature is not ready for release (work in progress, or out of scope in current release), it should not be merged in to master or dev (frontend/backend) branch.      
If branch ends with `_wip` - no auto-tests or builds will be run. 

flow: work on features in your branch, when it's done - make merge request into main dev repo (`frontend/dev` or `backend/dev`). Lead will review the code, and if it is okay - send for building.


Registry image names:
    
    app_name = frontend, backend, router...
    
    app_name:CI_COMMIT_REF_SLUG - images for specific branch
    app_name:latest - stable builds, reffer to master branch
