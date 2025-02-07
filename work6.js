const RB=ReactBootstrap;
const {Alert, Card, Button, Table} = ReactBootstrap;


class App extends React.Component {
    constructor() {
        super();
        this.state = {
            scene: 0,
            students: [],
            stdid: "",
            stdtitle: "",
            stdfname: "",
            stdlname: "",
            stdemail: "",
            stdphone: "",
            user: null,
        };

        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({ user: user.toJSON() });
            } else {
                this.setState({ user: null });
            }
        });
    }

    title = (
        <Alert variant="info">
            <b>Work6 :</b> Firebase
        </Alert>
    );

    footer = (
        <div>
            By 663380560-5 Thanyalak Sasen<br />
            College of Computing, Khon Kaen University
        </div>
    );

    edit(std) {
        this.setState({
            stdid: std.id,
            stdtitle: std.title,
            stdfname: std.fname,
            stdlname: std.lname,
            stdemail: std.email,
            stdphone: std.phone,
        });
    }

    readData() {
        db.collection("students").get().then((querySnapshot) => {
            var stdlist = [];
            querySnapshot.forEach((doc) => {
                stdlist.push({ id: doc.id, ...doc.data() });
            });
            this.setState({ students: stdlist });
        });
    }

    autoRead() {
        db.collection("students").onSnapshot((querySnapshot) => {
            var stdlist = [];
            querySnapshot.forEach((doc) => {
                stdlist.push({ id: doc.id, ...doc.data() });
            });
            this.setState({ students: stdlist });
        });
    }

    insertData() {
        db.collection("students").doc(this.state.stdid).set({
            title: this.state.stdtitle,
            fname: this.state.stdfname,
            lname: this.state.stdlname,
            phone: this.state.stdphone,
            email: this.state.stdemail,
        });
    }

    delete(std) {
        if (confirm("ต้องการลบข้อมูล")) {
            db.collection("students").doc(std.id).delete();
        }
    }

    google_login() {
        var provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope("profile");
        provider.addScope("email");
        firebase.auth().signInWithPopup(provider);
    }

    google_logout() {
        if (confirm("Are you sure?")) {
            firebase.auth().signOut();
        }
    }

    render() {
        return (
            <Card>
                <Card.Header>{this.title}</Card.Header>
                <LoginBox user={this.state.user} app={this} />
                <Card.Body>
                    {this.state.user ? (
                        <>
                            <Button onClick={() => this.readData()}>Read Data</Button>
                            <Button onClick={() => this.autoRead()}>Auto Read</Button>
                            <StudentTable data={this.state.students} app={this} />
                            <Card.Footer>
                                <b>เพิ่ม/แก้ไขข้อมูล นักศึกษา :</b><br />
                                <TextInput label="ID" app={this} value="stdid" style={{ width: 120 }} />
                                <TextInput label="คำนำหน้า" app={this} value="stdtitle" style={{ width: 100 }} />
                                <TextInput label="ชื่อ" app={this} value="stdfname" style={{ width: 120 }} />
                                <TextInput label="สกุล" app={this} value="stdlname" style={{ width: 120 }} />
                                <TextInput label="Email" app={this} value="stdemail" style={{ width: 150 }} />
                                <TextInput label="Phone" app={this} value="stdphone" style={{ width: 120 }} />
                                <Button onClick={() => this.insertData()}>Save</Button>
                            </Card.Footer>
                        </>
                    ) : (
                        <p>กรุณาเข้าสู่ระบบเพื่อใช้งาน</p>
                    )}
                </Card.Body>
                <Card.Footer>{this.footer}</Card.Footer>
            </Card>
        );
    }
}



  const container = document.getElementById("myapp");
  const root = ReactDOM.createRoot(container);
  root.render(<App />);



  const firebaseConfig = {
    apiKey: "AIzaSyDSxLXJ7x3uCl3yjkhxaoLgl0e2Pp4FtMI",
    authDomain: "web2024thanyalak.firebaseapp.com",
    projectId: "web2024thanyalak",
    storageBucket: "web2024thanyalak.firebasestorage.app",
    messagingSenderId: "434077455546",
    appId: "1:434077455546:web:f31f8c4f962cfa32a19e83",
    measurementId: "G-D8VHRYCVJE"
  };

  firebase.initializeApp(firebaseConfig);      
const db = firebase.firestore();


function StudentTable({data, app}){
    return <table className='table'>
    <tr>
        <td>รหัส</td>
        <td>คำนำหน้า</td>
        <td>ชื่อ</td>
        <td>สกุล</td>
        <td>email</td>
        </tr>
        {
          data.map((s)=><tr>
          <td>{s.id}</td>
          <td>{s.title}</td>
          <td>{s.fname}</td>
          <td>{s.lname}</td>
          <td>{s.email}</td>
          <td><EditButton std={s} app={app}/></td>
          <td><DeleteButton std={s} app={app}/></td>     
          </tr> )
        }
    </table>
  }





  function TextInput({label,app,value,style}){
    return <label className="form-label">
    {label}:    
     <input className="form-control" style={style}
     value={app.state[value]} onChange={(ev)=>{
         var s={};
         s[value]=ev.target.value;
         app.setState(s)}
     }></input>
   </label>;  
  }

  function EditButton({std,app}){
    return <button onClick={()=>app.edit(std)}>แก้ไข</button>
   }
 

   function DeleteButton({std,app}){    
    return <button onClick={()=>app.delete(std)}>ลบ</button>
  }


  function LoginBox(props) {
    const u = props.user;
    const app = props.app;
    if (!u) {
        return <div><Button onClick={() => app.google_login()}>Login</Button></div>
    } else {
        return <div>
            <img src={u.photoURL} />
            {u.email}<Button onClick={() => app.google_logout()}>Logout</Button></div>
    }
}


 

   






