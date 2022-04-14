## Product Roadmap Checklist

### V1

- [x]  View bills
    - [x]  Retrieve cached bills if available
    - [x]  Fetch bills from Supabase if user is cached
    - [ ]  Pull down to refresh
    - [ ]  Improved styling for Due Date & Reminder Set
        - [ ]  Different UI for Bills that are closer due (e.g. 3 days, 1 week, 1 month.)
        - [ ]  Clock icon to pulse if user unchecks a completed bill
- [x]  Add bills
    - [x]  Select deadline
    - [x]  Bills should be added to local cache first before trying to POST to Supabase
    - [x]  Post to Supabase if user is cached
    - [ ]  Payee autocomplete: Scrape for SG local billing organisations
    - [ ]  Caching of user inputs on BillFormScreen
    - [ ]  Upload Bill PDF from their billing organisation
    - [ ]  Config for 1-time bill or recurring bill e.g. monthly/annual subscription
    - [ ]  Duplicate bill
- [x]  User Management
    - [x]  Register Prompt to be shown on press for info icon on account-locked features
    - [x]  Log out
        - [x]  Remove user from cache
    - [x]  Log in
        - [x]  Cache user information
        - [x]  Sync existing device cache (bills, reminders that do not have ids) to cloud
        - [x]  Retrieve and cache cloud data that do not exist on device
- [x]  Missed Bills
    - [x]  Mark as acknowledged (Archive bill)
- [ ]  Create notifications
  - [ ]  Native notifications
    - [x]  Timestamp trigger notifications
    - [ ]  Interval trigger notifications (dependent on recurring bills)
    - [x]  Clicking notifications allow user to navigate to the UpcomingBillsScreen directly
- [ ]  Edit bills
    - [x]  Allow users to mark as complete manually
    - [ ]  Edit notifications
- [ ]  Delete bills
    - [ ]  Delete notifications
- [ ]  Network handling
    - [ ]  only fetch bills for account users
    - [ ]  only post bills for account users
    - [ ]  Refresh only works if there is internet
- [ ]  Summary View
  - [ ]  Edge function to create bill summary
  - [ ]  UI to show users by month
    - [ ]  nett bill expenses they have incurred 
    - [ ]  bills that they have missed
  - [ ]  Show archived bills
- [ ]  Personalization
  - [ ]  Let users set their own name
  - [ ]  Light/dark mode toggle
  - [ ]  Notification sound, Billy mascot

### V1.1

- [ ] Create notifications
  - [ ]  Integration with Firebase Cloud Messaging (FCM)
    - [x]  Set up FCM on mobile app
    - [ ]  Edge function to send remote notifications via pub sub topics (e.g. app upgrade is available)
    - [ ]  Edge function to send remote notifications to specific users via FCM (e.g. paid plan is running out)
  - [ ]  Integration with Google Calendar
    - [ ]  Edge function to create Google Calendar Reminders
- [ ]  Access Billy from the Web
## Going Production Checklist

- [ ] [Supabase Checklist](https://supabase.com/docs/going-into-prod)
- [ ] Add analytics

## Videos

https://user-images.githubusercontent.com/35736525/162599847-2573fe46-906d-4405-9ad2-03a69eba8001.mp4

https://user-images.githubusercontent.com/35736525/162599856-867a0344-9bff-4602-8f52-9a7171924c76.mp4

https://user-images.githubusercontent.com/35736525/162599866-929f880f-1f63-4249-a34d-fe28a8366773.mp4
