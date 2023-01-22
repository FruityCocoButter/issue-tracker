{/*This jsx file will be fetched from the server as the html file is run in the browser
It is transpiled in the browser into JavaScript*/}

{/*BorderWrap component to apply a specified border style onto any component*/}

//define reviver function
const dateRegEx = new RegExp("^\\d\\d\\d\\d-\\d\\d-\\d\\d")

var reviveDate = function(key, value){
        if(dateRegEx.test(value)){
            return new Date(value);
        }

        else{return value;}
    }

class IssueRow extends React.Component{
    render(){

        return (<tr>
            <td>{this.props.issues.id}</td>
            <td>{this.props.issues.issue_title}</td>
            <td>{this.props.issues.author}</td>
            <td>{this.props.issues.status}</td>
            <td>{this.props.issues.created.toDateString()}</td>
            <td>{this.props.issues.due.toDateString()}</td>
            <td>{this.props.issues.type}</td>
        </tr>
        ) ;       
    }
}


class IssueFilter extends React.Component{
    render(){
        return (
            <div id="issue-filter">
                Filter
            </div>
        );
    }
}

class IssueTable extends React.Component{
    constructor(){
        super();
    }


    render(){
        return (
            <table className="bordered-table">
                <thead>
                    <tr>
                        <th>id</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Due</th>
                        <th>Type</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.issues.map(issue => <IssueRow key={issue.id} issues={issue}/>)}
                </tbody>
            </table>
        );
    }
}

class IssueAdd extends React.Component{
    constructor(){
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event){
        event.preventDefault(); {/*prevents loading of a new screen*/}
        const form = document.forms.issueAdd;

        const nextIssue = {issue_title:form.title.value, author:form.owner.value, status:Math.floor(Math.random()*5), type:"bug fix", due: new Date((new Date()).getTime() + 1000*60*60*24*10)};
        setTimeout(() => this.props.createIssue(nextIssue), 2000);

        form.owner.value ="";
        form.title.value = "";
    }

    render(){
        

        return (
            <form name="issueAdd" onSubmit={this.handleSubmit}>
                <input type="text" name="owner" placeholder="Owner" /> <br/>
                <input type="text" name="title" placeholder="Title" /> <br/>
                <button >Add</button>
            </form>
        );
    }
}


class IssueList extends React.Component{
    constructor(){
        super();
        this.state = {issues: []};
        this.createIssue = this.createIssue.bind(this);
    }

    async loadData(){
        const query = `query{
            issueList{
                id
                issue_title
                author
                status
                created
                due
                type
            }}`;

        const response = await fetch('/graphql', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({query})
        });

        const result = await response.text();  //response object as text
        const revived = JSON.parse(result, reviveDate);

        setTimeout(() => this.setState({issues: revived.data.issueList}), 500);
    }

    componentDidMount(){
        this.loadData();
    }

    async createIssue(issue){        
        {/*const issueCopy = this.state.issues.slice(); 
        issueCopy.push(issue);
        this.setState({issues: issueCopy});
        */}

        const query = `
        mutation{
            newIssue(input: {
              issue_title: \"${issue.issue_title}\",
              author: \"${issue.author}\",
              status: ${issue.status},
              due: \"${issue.due.toDateString()}\",
              type: \"${issue.type}\"
            }){
              id
              issue_title
              status
              author
              created
              due
              type
            }
          }
        `;
        
        const response = await fetch('/graphql', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({query})
        });

        const result = await response.text();  //response object as text
        console.log(query);
        console.log(result);
        const revived = JSON.parse(result, reviveDate);

        setTimeout(() => this.setState({issues: revived.data.newIssue}), 500);
    }

    async addIssue(){
        


    }

    render(){
        return(
            <React.Fragment>
                <h1>Issue Tracker</h1>
                <IssueFilter/>
                <hr/>
                <IssueTable issues={this.state.issues}/>
                <hr/>
                <IssueAdd createIssue={this.createIssue}/>
            </React.Fragment>
        );
    }
}

const element = <IssueList/>;

ReactDOM.render(element, document.getElementById("content"));