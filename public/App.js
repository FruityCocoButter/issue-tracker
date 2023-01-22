{/*This jsx file will be fetched from the server as the html file is run in the browser
 It is transpiled in the browser into JavaScript*/}
{/*BorderWrap component to apply a specified border style onto any component*/}

//define reviver function
const dateRegEx = new RegExp("^\\d\\d\\d\\d-\\d\\d-\\d\\d");
var reviveDate = function (key, value) {
  if (dateRegEx.test(value)) {
    return new Date(value);
  } else {
    return value;
  }
};
class IssueRow extends React.Component {
  render() {
    return /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, this.props.issues.id), /*#__PURE__*/React.createElement("td", null, this.props.issues.issue_title), /*#__PURE__*/React.createElement("td", null, this.props.issues.author), /*#__PURE__*/React.createElement("td", null, this.props.issues.status), /*#__PURE__*/React.createElement("td", null, this.props.issues.created.toDateString()), /*#__PURE__*/React.createElement("td", null, this.props.issues.due.toDateString()), /*#__PURE__*/React.createElement("td", null, this.props.issues.type));
  }
}
class IssueFilter extends React.Component {
  render() {
    return /*#__PURE__*/React.createElement("div", {
      id: "issue-filter"
    }, "Filter");
  }
}
class IssueTable extends React.Component {
  constructor() {
    super();
  }
  render() {
    return /*#__PURE__*/React.createElement("table", {
      className: "bordered-table"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "id"), /*#__PURE__*/React.createElement("th", null, "Title"), /*#__PURE__*/React.createElement("th", null, "Author"), /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", null, "Created"), /*#__PURE__*/React.createElement("th", null, "Due"), /*#__PURE__*/React.createElement("th", null, "Type"))), /*#__PURE__*/React.createElement("tbody", null, this.props.issues.map(issue => /*#__PURE__*/React.createElement(IssueRow, {
      key: issue.id,
      issues: issue
    }))));
  }
}
class IssueAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(event) {
    event.preventDefault();
    {/*prevents loading of a new screen*/}
    const form = document.forms.issueAdd;
    const nextIssue = {
      issue_title: form.title.value,
      author: form.owner.value,
      status: Math.floor(Math.random() * 5),
      type: "bug fix",
      due: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10)
    };
    setTimeout(() => this.props.createIssue(nextIssue), 2000);
    form.owner.value = "";
    form.title.value = "";
  }
  render() {
    return /*#__PURE__*/React.createElement("form", {
      name: "issueAdd",
      onSubmit: this.handleSubmit
    }, /*#__PURE__*/React.createElement("input", {
      type: "text",
      name: "owner",
      placeholder: "Owner"
    }), " ", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("input", {
      type: "text",
      name: "title",
      placeholder: "Title"
    }), " ", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("button", null, "Add"));
  }
}
class IssueList extends React.Component {
  constructor() {
    super();
    this.state = {
      issues: []
    };
    this.createIssue = this.createIssue.bind(this);
  }
  async loadData() {
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
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query
      })
    });
    const result = await response.text(); //response object as text
    const revived = JSON.parse(result, reviveDate);
    setTimeout(() => this.setState({
      issues: revived.data.issueList
    }), 500);
  }
  componentDidMount() {
    this.loadData();
  }
  async createIssue(issue) {
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
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query
      })
    });
    const result = await response.text(); //response object as text
    console.log(query);
    console.log(result);
    const revived = JSON.parse(result, reviveDate);
    setTimeout(() => this.setState({
      issues: revived.data.newIssue
    }), 500);
  }
  async addIssue() {}
  render() {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h1", null, "Issue Tracker"), /*#__PURE__*/React.createElement(IssueFilter, null), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(IssueTable, {
      issues: this.state.issues
    }), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(IssueAdd, {
      createIssue: this.createIssue
    }));
  }
}
const element = /*#__PURE__*/React.createElement(IssueList, null);
ReactDOM.render(element, document.getElementById("content"));