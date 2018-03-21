import React, { Component, Fragment } from 'react';
import './App.css';

var firebase = null;

const SIGN_IN = 'signIn';

const SIGN_UP = 'signUp';

const ProfilePicture = ({url, alt="Profile Picture"}, context) => {
  return <span className="profile-picture"> <img src={url} alt={alt} title={alt} /></span>
}

const Widget = ({title, listItems, className='', renderItems=null}, context) => {
  return <div className={"widget " +  className}>
  <div className="title">{title}</div>
    <ul> {
      listItems ? listItems.map((items, i)=><li key={i}>{renderItems ? renderItems(items) : items}</li>) : <li>Loading...</li>
    }</ul>
  </div>;
};

const Achievements = ({ achievements, title='Achievements' }, context) => {
  return <Widget className="achievement" title={title} listItems={achievements}/>
}

const Educations = ({ educations, title='Education' }, context) => {
  return <Widget className="education" title={title} listItems={educations} renderItems={(education)=><Fragment><span>{education.education}</span><span>{education.score}</span><span>{education.detail}</span></Fragment>}/>
}

const Experience = ({ experience, title='Experience' }, context) => {
  return <Widget className="experience" title={title} listItems={experience} renderItems={(exp)=><Fragment><span>{exp.designation}</span><span>{exp.org}</span><span>{exp.duration}</span></Fragment>}/>
}

const Star = ({active}, context) => {
  return <span className={'star' + (active ? ' active' : '')}></span>;
}

const Stars = ({value, max, valueOnly=false}, context) => {
  return <span className="stars">{Array.apply(null, { length: valueOnly ? value : max }).map((val, i)=><Star key={i} active={i<value} />)}</span>
}
const SkillSet = ({ skills, title='Skill Set', sortByStars=true }, context) => {
  const items = skills ? Object.keys(skills).map(key=>({name: key, detail: skills[key]})) : null;
  if(items && sortByStars) {
    items.sort((a,b)=>b.detail.star-a.detail.star)
  }
  return <Widget className="skillset" title={title} listItems={items} renderItems={(skill)=><Fragment><span>{skill.name}</span><Stars value={skill.detail.star} max={5} valueOnly /></Fragment>}/>
}

const AuthUser = ({ currentUser, onSendVerificationEmail, emailMessage, onLogout }, context) => {
  const {displayName, email, /*photoURL, uid,*/ emailVerified } = currentUser;
  if(!emailVerified) {
    return <div className='auth-user'>
      <span>Hello <span className='user-name'>{displayName || email.split('@')[0]}</span>! </span>
      <span><span>Please verify your email. </span> {emailMessage ? <span>{emailMessage}</span> : <a  onClick={onSendVerificationEmail}>Resend Verification Email</a>}</span>
    </div>
  }
  return (<div className='auth-user'>
      <span>Hello <span className='user-name'>{displayName || email.split('@')[0]}</span>! <a  onClick={onLogout}>Sign Out</a></span>
    </div>)
}

const NoAuth = ({onSignIn, onSignUp}, context) => {
  return <div className='no-auth'><a  onClick={onSignIn}>sign in</a>|<a  onClick={onSignUp}>sign up</a></div>
}
class SignInOrSignUp extends Component {

  constructor(props, context) {
    super(props, context);
    this.onSubmit = this.onSubmit.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }

  email = null;

  password = null;

  emailClass = null;

  passwordClass = null;

  onInputChange = e => {
    this[e.target.name] = e.target.value.trim();
  }

  onSubmit = e => {
    const {name}=e.target;
    this.emailClass = this.email === '' ? 'input-error' : null;
    this.passwordClass = this.password === '' ? 'input-error' : null;

    if(this.emailClass || this.passwordClass) {
      this.forceUpdate();
      return;
    }

    if(name === SIGN_IN) {
      firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        .then(result=>{
            console.debug(result);
            this.props.onSubmitSuccess && this.props.onSubmitSuccess();
          },
          reason=>{
            alert(reason.message);
          }
        )
        .catch(function(error) {
          // Handle Errors here.
          //var errorCode = error.code;
          var errorMessage = error.message;
          console.debug(error);
          alert(errorMessage);
          // ...
        }
      );
    } else if(name === SIGN_UP) {
      // TODO ::: this.props.onSubmitSuccess && this.props.onSubmitSuccess();
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(result=>{
        console.debug(result);
        this.props.onSubmitSuccess && this.props.onSubmitSuccess();
      }, reason=>{
        alert(reason.message);
      }).catch(error => {
        // Handle Errors here.
        //var errorCode = error.code;
        var errorMessage = error.message;
        console.debug(error);
        alert(errorMessage);
        // ...
      });
    }
  }

  componentDidMount() {
    if(this.nameInput) {
      this.nameInput.setSelectionRange(0, this.nameInput.value.length-1);
      //this.nameInput.focus();
    }
  }

  render() {
    return (
    <div className='form-sign-in-up'>
      <input name="email" onChange={this.onInputChange} placeholder="Email" className={this.emailClass} ref={input=>this.nameInput=input} autoFocus autoComplete="false" autoSave="false"  />
      <input name="password" type='password' onChange={this.onInputChange} placeholder="Pasword" className={this.passwordClass} autoComplete="false" autoSave="false" />
      <a name={SIGN_IN} onClick={this.onSubmit}>Sign In</a>|<a name={SIGN_UP} onClick={this.onSubmit}>Sign Up</a>
    </div>)
  }
}

class Auth extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      currentUser: props.currentUser,
    };

    this.onSendVerificationEmail = this.onSendVerificationEmail.bind(this);
    this.clearEmailMessage = this.clearEmailMessage.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if(this.state.currentUser !== nextProps.currentUser) {
      this.setState({currentUser: nextProps.currentUser});
    }
  }

  onSignIn = () => {
    this.setState({
      showForm: true
    });
  };

  onSignUp = () => {
    this.setState({
      showForm: true
    });
  };

  onLogout = () => {
    firebase.auth().signOut().then(acceptParam=>{
      console.debug(acceptParam);
    }, rejectParam=>{
      console.debug(rejectParam);
    }).catch(error=>{
      console.debug(error);
    });
  };

  clearEmailMessage = () => {
    this.setState({emailMessage: null});
  }

  onSendVerificationEmail = () => {
    var user = firebase.auth().currentUser;
    user.sendEmailVerification().then(() => {
      this.setState({
        emailMessage: 'E-Mail sent. Check You Inbox!',
      }, ()=> {
        setTimeout(this.clearEmailMessage, 2000);
      });
    }).catch((error) => {
      this.setState({
        emailMessage: 'Failed to send E-Mail.',
      }, ()=> {
        setTimeout(this.clearEmailMessage, 2000);
      });
    });
  };

  render() {
    const { currentUser, showForm, emailMessage=null } = this.state;
    if(!currentUser && showForm) {
          return <div className='auth'>
            <SignInOrSignUp onSubmitSuccess={e=>this.setState({showForm: false})} />
          </div>;
    }
    return <div className='auth'>
      {currentUser ?  <AuthUser currentUser={currentUser} onLogout={this.onLogout} onSendVerificationEmail={this.onSendVerificationEmail} emailMessage={emailMessage} /> :  <NoAuth onSignIn={this.onSignIn} onSignUp={this.onSignUp} />}
    </div>
  }
}

class App extends Component {

  componentWillMount() {

    window.document.addEventListener('DOMContentLoaded', () =>{
      // Get a reference to the database service

      firebase = window.firebase;

      const currentUser = firebase.auth().currentUser;

      this.setState({currentUser});

      this.profile = firebase.database().ref("profile");

      this.profile.on('value', (snapshot) => {
        this.setState(snapshot.val()); // end of setstate // {achievements, experience, educations, title, desc, picture, name, skills}
      }); //end of on value

      firebase.auth().onAuthStateChanged(currentUser => {
        console.log('displayName:', currentUser, currentUser && currentUser.displayName);
        this.setState({
          currentUser: currentUser,
        });
      });

    });// end of dom content loaded
  }

  componentWillUnmount() {
    if(this.profile) {
      this.profile.off();
    }
  }

  state = {
    achievements:null, experience:null, educations:null, title: '', desc: '', currentUser: null
  }

  render() {
    const {achievements, experience, educations, title, desc, currentUser, picture, name, skills} = this.state;
    currentUser &&  console.log('displayName:', currentUser, currentUser.displayName);
    const titles = title.split(',');
    return (
      <div className="App">
        
        <div id="message">
          <Auth currentUser={currentUser} />
          <div style={{textAlign: 'center', }}>
            {picture && <ProfilePicture url={picture} alt={name} /> }
            <h1>{name}</h1>
            {
              titles.map(title=><h2 key={title}>{title}</h2>)
            }
            <p>{desc}</p>
            <Achievements achievements={achievements} />
            <Experience experience={experience} />
            <SkillSet skills={skills} />
            <Educations educations={educations} />
          </div>
      </div>
      </div>
    );
  }
}

export default App;
