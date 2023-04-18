# Quiz Builder

Quiz Builder is a powerful, flexible, and easy-to-use quiz creation tool. It allows you to create quizzes with various question types, including single select, multiple select, true-false, fill-in-the-blanks, and drag-and-drop. The user-friendly interface enables you to manage your quizzes effortlessly and efficiently.

## Features

- Create quizzes with various question types
- Add, update, and remove questions
- Randomize question order
- Calculate quiz score and set a passing grade
- Prevent changing answers after submission
- Allow language switching
- Display individual option feedback
- Provide end quiz button and feedback recap
- Export quiz data as JSON
- Import quiz data from JSON

## Installation

Clone this repository and install the necessary dependencies:

```
git clone https://github.com/csabourin/QuizGen-Creator.git
cd quiz-builder
npm install
```

## Usage

Start the development server:

```
npm run dev
```

The application will be available at `http://localhost:1573`.

## Project Structure

The main components of the project are:

- `Question.vue`: The component for creating and editing questions
- `QuestionPreview.vue`: The component for displaying question previews
- `data`: Contains quiz settings, questions, and other data needed for the application
- `methods`: Contains the methods used for handling quiz data and user interactions
- `computed`: Contains computed properties based on the data and used for rendering the application

## Contributing

If you have any suggestions, improvements, or bug reports, feel free to submit a pull request or create an issue.

## License

Quiz Builder is licensed under the MIT License.
