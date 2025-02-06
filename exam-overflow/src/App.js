//React
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
//Redux
import { Provider } from "react-redux";
import store from "./redux/store";
import { authUser } from "./redux/actions/userActions";
//Pages
import login from "./pages/login";
import register from "./pages/register";
import landing from "./pages/landing";
import page404 from "./pages/page404";
import questions from "./pages/questions";
import browseExamPapers from "./pages/browseExamPapers";
import answers from "./pages/answers";
import postExamPaperForm from "./pages/postExamPaperForm";
import profile from "./pages/profile";
import editProfile from "./pages/editProfile";
import addCourse from "./pages/addCourse";
import addMajor from "./pages/addMajor";
import addAdmin from "./pages/addAdmin";
import approveExamPapers from "./pages/approveExamPapers";
import reportedPosts from "./pages/reportedPosts";

//Components
import Copyright from "./components/Copyright";
import NavBar from "./components/NavBar";

import axios from "axios";

axios.defaults.baseURL = "https://localhost:5001/api/";

store.dispatch(authUser());

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <Router>
          <NavBar />
          <Switch>
            <Route exact path="/" component={landing} />
            <Route exact path="/login" component={login} />
            <Route exact path="/register" component={register} />
            <Route path="/browse_exam_papers" component={browseExamPapers} />
            <Route path="/browse_questions/:id" component={questions} />
            <Route path="/browse_answers/:id" component={answers} />
            <Route path="/profile/edit/:id" component={editProfile} />
            <Route path="/profile/:id" component={profile} />
            <Route path="/post_exam_paper_form" component={postExamPaperForm} />
            <Route path="/add_course" component={addCourse} />
            <Route path="/add_major" component={addMajor} />
            <Route path="/add_admin" component={addAdmin} />
            <Route path="/approve_exam_papers" component={approveExamPapers} />
            <Route path="/reported_posts" component={reportedPosts} />
            <Route component={page404} />
          </Switch>
          <Copyright />
        </Router>
      </Provider>
    </div>
  );
}

export default App;
