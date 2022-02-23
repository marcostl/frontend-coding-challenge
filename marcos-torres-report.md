# Weld's front-end coding challenge

## Tasks

- [x] Add a description field to the data points
- [x] The fake internet speed in the fake api is pretty slow, so some loading states might be needed
- [x] Make the app support adding of new data points through another page on /new (use useReducer for managing the internal state of this page) (use react-router-dom for routing)
- [x] It should be possible to clear any field with a click on a button
- [x] The form should be validated
- [x] If you add a lot of data points to the list, it would probably be nice with some pagination
- [x] The app should also support editing the title and description of the data points on the route /edit/:id
- [ ] When deleting a data point, it should be possible to regret and restore it within 10 seconds in some way
- [ ] Make a components structure that you think makes sense for the app
- [ ] Use tailwindcss for styling, don't write any custom css

## Future work

- Improve the `LoadingMessage` component and add some animation to give users some feedback.

## Journal

#### 20th Feb ~22:00 - ~23:40

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
  - I've created a new `LoadingMessage` component that displays a message when the application is loading/updating data The component seems a bit static, as if the application wasn't doing anything. If I have time I'll come back and improve the component.

#### 21st Feb ~21:00 - ~00:30
- Implement the `/new` page
  - Add a `Page` component to be used across pages to maintin style
  - Add `DataForm` component with a reducer to handle changes in inputs and validation
  - With my current implementation, and depending on the validators it can happen that an error message is "prematurely" shown to the user. For example, if we added a min length validator for the description, as soon as the user starts typing the error would be shown. This is weird and shouldn't be the case, the most straight forward solution is to use a "debounced" function that would validate the input after X ms have passed since the last keystroke of the user. I've avoided this mecahnism in my solution for clarity purposes.
- Add tests for the reducer and the new `DataForm` component

#### 22nd Feb ~18:15 - ~19:15
- Implement the `/edit` page
  - I refactored a little bit the `DataForm` component so it could be reused for the edit page
  - I implemented the edit feature so it takes the data from the `location.state` coming from `react-router` if present. If not, it will fall-back into the Apollo endpoint and it will show a loading message. If no data is returned after Apollo is used then an error is shown along with a link to go back to the main page.

#### 22nd Feb ~22:30 - ~01:00
- Implement the custom hook that will handle the pagination
  - I've also included some tests for these as testing hooks needs to be handled specifically.
  - Later I noticed that it might happen that the only item of the last page is deleted and would leave the navigator state inconsistent. I added a useEffect hook to correct this edge case.
- Implement the `PageNavigator` component and modify the `NewDataForm` so it sets some location state and the app will navigate to the last page when the addition of the data is completed.
  - I could have had implemented this behvaiour for the `EditDataForm`. but I discarded it for simplicity purposes. Also, the `EditDataForm` component would need to be aware of the page where the data that's being edited is.