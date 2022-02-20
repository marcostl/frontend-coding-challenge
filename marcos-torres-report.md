# Weld's front-end coding challenge

## Tasks

- [x] Add a description field to the data points
- [x] The fake internet speed in the fake api is pretty slow, so some loading states might be needed
- [ ] Make the app support adding of new data points through another page on /new (use useReducer for managing the internal state of this page) (use react-router-dom for routing)
- [ ] It should be possible to clear any field with a click on a button
- [ ] The form should be validated
- [ ] If you add a lot of data points to the list, it would probably be nice with some pagination
- [ ] The app should also support editing the title and description of the data points on the route /edit/:id
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