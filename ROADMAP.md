## Product Roadmap Checklist

- [x]  View bills
    - [x]  Retrieve cached bills if available
    - [x]  Fetch bills from Supabase if user is cached.
    - [ ]  Improved styling for Due Date & Reminder Set
        - [ ]  Different UI for Bills that are closer due (e.g. 3 days, 1 week, 1 month.)
        - [ ]  Clock icon to pulse if user unchecks a completed bill
- [x]  Add bills
    - [x]  Select deadline
    - [x]  Bills should be added to local cache first before trying to POST to Supabase
    - [x]  Post to Supabase if user is cached
    - [ ]  Payee autocomplete: Scrape for SG local billing organisations
    - [ ]  Create notifications
    - [ ]  Caching of user inputs on BillFormScreen
    - [ ]  Upload Bill PDF from their billing organisation
    - [ ]  Config for 1-time bill or recurring bill e.g. monthly/annual subscription
- [x]  User Management
    - [x]  Register Prompt to be shown on press for info icon on account-locked features
    - [x]  Log out
        - [x]  Remove user from cache
    - [x]  Log in
        - [x]  Cache user information
        - [x]  Sync existing device cache (bills, reminders that do not have ids) to cloud
        - [x]  Retrieve and cache cloud data that do not exist on device
- [x]  Missed Bills
    - [ ]  Mark as acknowledged
- [ ]  Edit bills
    - [ ]  Allow users to mark as complete manually
    - [ ]  Edit notifications
- [ ]  Delete bills
    - [ ]  Delete notifications
- [ ]  Recurring bills
- [ ]  Network handling
    - [ ]  only fetch bills for account users
    - [ ]  only post bills for account users
    - [ ]  Refresh only works if there is internet
- [ ]  Summary View
  - [ ]  Show users nett bill expenses they have incurred by month, and bills that they have missed
- [ ]  Access Billy from the Web


## Videos

https://user-images.githubusercontent.com/35736525/162599847-2573fe46-906d-4405-9ad2-03a69eba8001.mp4

https://user-images.githubusercontent.com/35736525/162599856-867a0344-9bff-4602-8f52-9a7171924c76.mp4

https://user-images.githubusercontent.com/35736525/162599866-929f880f-1f63-4249-a34d-fe28a8366773.mp4