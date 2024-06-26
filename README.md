# Wedge: An AI Powered Productivity Platform

**Maximize Your Efficiency and Achieve Your Goals with Wedge**

**Test Now**: [https://www.wedgeai.netlify.app](https://www.wedgeai.netlify.app)

## Inspiration

The inspiration for Wedge came from the realization that traditional project management tools often lack engagement and can feel tedious. We wanted to create a tool that not only helps manage projects effectively but also makes the process enjoyable through gamification. By turning tasks and milestones into a game-like experience, we aim to boost motivation and productivity.

## What it does

Wedge is a gamified AI project management assistant that transforms the way users manage their projects. It incorporates features like task and milestone tracking, AI-powered task recommendations, automated summaries, and collaboration tools. Gamification elements such as points, achievements, badges, and leaderboards are integrated to make project management fun and engaging.

## How we built it

1. **User Interface Design:**

   - Used React and Material UI to develop a visually appealing and intuitive interface with a dashboard.
   - Ensured ease of navigation and interaction for users.

2. **Data Management with Azure Cosmos DB:**

   - Implemented a robust data schema to store project data, tasks, and gamification metrics.
   - Organized data efficiently for quick retrieval and real-time updates.

3. **Integrating Azure OpenAI API:**

   - Used natural language processing to facilitate user interactions and queries.
   - Generated task recommendations using the API.

4. **Developing Gamification Mechanics:**
   - Created a leveling system

### Challenges we ran into

- **Time Constraint:** Considering that we were only able to begin after May 20th due to University exams, and then finding trouble with Phase 1's Node.js Developer Guide as well as the Python guide, we weren't left with much time to work on the project.
- **Balancing Gamification and Productivity:** Ensuring that gamification elements enhanced productivity without becoming distractions was a significant challenge.
- **AI Integration:** Integrating the Azure OpenAI API to provide accurate and helpful recommendations, summaries, and motivational messages took significant effort and fine-tuning.
- **User Experience:** Designing an intuitive and engaging user interface that catered to both individual users and teams was an ongoing challenge, requiring continuous feedback and iteration.

### Accomplishments that we're proud of

- Deploying a working Minimum Viable Product (MVP) in a short time-span
- Successfully integrating gamification elements that make project management enjoyable and engaging.
- Building a robust and efficient data management system using Azure Cosmos DB.
- Developing a powerful AI assistant with the Azure OpenAI API that provides valuable recommendations and summaries.
- Creating a user-friendly interface that enhances the overall user experience.

### What we learned

- The importance of balancing fun and productivity in a gamified application.
- Best practices for data management and real-time updates using Azure Cosmos DB.
- How to leverage the Azure OpenAI API for natural language processing and AI-powered features.
- The value of continuous user feedback in refining and improving the user experience.

### What's next for Wedge

- **User Authentication & Authorisation**: Adding User Authentication and profiles using Firebase.
- **Productivity Features:** Adding more features such as habit management and text summarisation.
- **Useful Task Checking**: Use AI to determine whether the task specified by the user is productive or not. E.g. Doom-scrolling Instagram wouldn't count as productive but Finish Geography assignment would.
- **Better Gamification:** Badges, Leaderboard, Story-driven leveling.
- **Advanced Analytics:** Developing more advanced analytics to provide deeper insights into project performance and productivity.
- **Customization Options:** Allowing users to customize their gamification experience with personalized achievements and rewards.
- **Mobile App:** Creating a mobile version of Wedge to enable users to manage their projects on the go.
- **Integration with Other Tools:** Integrating Wedge with other popular productivity and project management tools to provide a seamless workflow, e.g., Google Calendar and Zoom

By continuously improving and expanding Wedge, we aim to make project management not only efficient but also enjoyable and motivating for users.
