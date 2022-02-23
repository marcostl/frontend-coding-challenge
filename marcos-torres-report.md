# Weld's front-end coding challenge

## Tasks

- [x] Add a description field to the data points
- [x] The fake internet speed in the fake api is pretty slow, so some loading states might be needed
- [x] Make the app support adding of new data points through another page on /new (use useReducer for managing the internal state of this page) (use react-router-dom for routing)
- [x] It should be possible to clear any field with a click on a button
- [x] The form should be validated
- [x] If you add a lot of data points to the list, it would probably be nice with some pagination
- [x] The app should also support editing the title and description of the data points on the route /edit/:id
- [x] When deleting a data point, it should be possible to regret and restore it within 10 seconds in some way
- [x] Make a components structure that you think makes sense for the app
- [x] Use tailwindcss for styling, don't write any custom css

## Comment

It's been fun doing this Weld's front-end coding exercise. I faced a couple of challenges, specially when implementing the undo feature, but I think the overall user experience that I achieved with my solution is good enough (there are some specific things that I left undone for clarity purposes though, more info below).

The challenge has taken me a total of ~10 hours. I've included below a journal with rough hours for each feature.

The general structure that I decided to follow for the application is:

- components: reusable components that could be used across more than one page
- hooks
- lib: it contains the `fakeApollo` interface and I envision it to be the directory where code to interact with different resources (ddb, authentication, APIs...) is placed
- pages: the different navigable paths and, at the same time, the _entry points_ of the application

Regarding testing, I’ve included 3 different files that test 3 different types of code: a plain reducer, a React component and a hook. I believe they cover more or less all different types of cases you could find in a React app.

Finally, the UI could be improved by quite a lot, I’ve decided not to spent a lot of time making it look beautiful as I believe it was not the intent of the challenge.

## Future work

- UX:
  - As mentioned, I think the entire app could use some help from a good UI/UX person.
  - The responsiveness of the app needs improvement as the site is not ready for a mobile display. This should be _trivial_ to do with Tailwind CSS classes and utilities. As mentioned above, I decided to neglect the UI in favor of the functionality.
  - I believe the accessibility of the page could be improved (e.g. in the forms, paginated navigation, etc)
- Functionality improvements:
  - CMD/CTRL + Z to undo
  - Error handling, the fakeApollo does not throw any error ever and that’s why I decided to ignore this aspect but on a normal application errors from the back-end are quite normal and should be handled appropriately
  - Metrics / analytics: I’d add some functionality to emit business / performance metrics (e.g. when the user perform a specific action like navigating to a different page, creating new data, etc)
- Performance:
  - I haven’t used the profiler to check the performance. I believe that with the current complexity of the application there shouldn’t be any lag/performance issue. Nevertheless an eye should be kept in this regard if the amount of data that the application is expected to handle is great and /or the functionality of the app is increased
  - I could’ve used more the `useCallback` and `useMemo` hooks but I decided not to for clarity purposes.
- Testing:
  - The application is very under-tested and I wouldn’t dare to use it in a production environment with real users.
  - Also, if this was a real application, I would have included UI tests to ensure a correct end to end functionality. Selenium or Playwright could be valid options for this.

## Journal

### 20th Feb ~22:00 - ~23:40

- Read the challenge and understand the required tasks
- Read the provided code
- Come up with a plan:
  - Update project structure to fit the 3 main pages of the app (`/`, `/new`, `/edit/:id`)
  - Add description
  - Add loading state
  - Add `/new` page
  - Add `/edit` page
  - Add pagination
  - Add undo feature
- Setup project
- Modify component structure to fit the different pages
- Add description, revamp UI a little bit
  - I left the `DataItem` component in the `main.tsx` file because i) the component is small enough and ii) for now (and I think for the entire project) it won't be used anywhere else. If the situation was different I would've moved to a `components` directory.
- Add loading state
  - I've created a new `LoadingMessage` component that displays a message when the application is loading/updating data
  - The component seems a bit static, as if the application wasn't doing anything. If I have time I'll come back and improve the component.

### 21st Feb ~21:00 - ~00:30

- Implement the `/new` page
  - Add a `Page` component to be used across pages to maintin style
  - Add `DataForm` component with a reducer to handle changes in inputs and validation
  - With my current implementation, and depending on the validators it can happen that an error message is "prematurely" shown to the user. For example, if we added a min length validator for the description, as soon as the user starts typing the error would be shown. This shouldn’t happen from a UX perspective, the most straight forward solution is to use a "debounced" function that would validate the input after X ms have passed since the last keystroke of the user. I've avoided this mechanism in my solution for clarity purposes.
- Add tests for the reducer and the new `DataForm` component

### 22nd Feb ~18:15 - ~19:15

- Implement the `/edit` page
  - I refactored a little bit the `DataForm` component so it could be reused for the edit page
  - I implemented the edit feature so it takes the data from the `location.state` coming from `react-router` if present. If not, it will fall-back into the Apollo endpoint and it will show a loading message. If no data is returned after Apollo is used then an error is shown along with a link to go back to the main page.

### 22nd Feb ~22:30 - ~01:00

- Implement the custom hook that will handle the pagination
  - I've also included some tests for these as testing hooks needs to be handled specifically.
  - Later, I noticed that it might occur that the only item of the last page is deleted and would leave the navigator state inconsistent. I added a `useEffect` hook to correct this edge case.
- Implement the `PageNavigator` component and modify the `NewDataForm` so it sets some location state and the app will navigate to the last page when the addition of the data is completed.
  - I could have had implemented this behvaiour for the `EditDataForm`. but I discarded it for simplicity purposes. Also, the `EditDataForm` component would need to be aware of the page where the data that's being edited is.

### 23rd Feb ~18:30 - ~20:50

- Fix the page numbers on the PageNavigator as they were 0-indexed instead of 1-indexed
- Add `Toast` component that will be later used for the undo functionality
  - I've decided to use a portal as the toast should not be part of the _normal_ DOM tree and should not interfere with it
- Add an undo reducer.
  - At the beginning I thought about creating a custom hook to contain the logic of the undo feature but it became quite unmanageable quickly so I switched back to the old reliable `useReducer` which worked like a charm. The undo state contains information about both the data removed and the UI state as they're tight together.
  - The state contains information about all data removed. This is on purpose:
    - Future versions of the aplication might allow the user to undo even after the 10s have passed
    - I'm aware that this can pose a problem in terms of memory usage if the user removes a lot ot items. This could be easily fixed by limiting the maximum number of items in the state. I didn’t do it to avoid overcomplicating the solution.
  - The undo implementation returns the removed data to the end of the list. I’m aware that there is not sufficient user feedback when the undo has been completed. Specifically, if the user is not on the page where the data is added back, they won’t see any data added back. One solution would be to move the user to the page where the data has been added. Again, I haven't implemented this feature for clarity purposes.
