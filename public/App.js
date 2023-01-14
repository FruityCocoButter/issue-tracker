{/*This jsx file will be fetched from the server as the html file is run in the browser
 It is transpiled in the browser into JavaScript*/}
const initialIssues = [{
  id: 1,
  issue_title: "movie trash",
  author: "Kgaugelo",
  status: 1,
  created: new Date("2023-01-03"),
  type: "bug fix"
}, {
  id: 2,
  issue_title: "Empty vending machine",
  author: "Kgaugelo",
  status: 3,
  created: new Date("2002-12-09"),
  type: "feature refactor"
}];
{/*BorderWrap component to apply a specified border style onto any component*/}
class IssueRow extends React.Component {
  render() {
    return /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, this.props.issues.id), /*#__PURE__*/React.createElement("td", null, this.props.issues.issue_title), /*#__PURE__*/React.createElement("td", null, this.props.issues.author), /*#__PURE__*/React.createElement("td", null, this.props.issues.status), /*#__PURE__*/React.createElement("td", null, this.props.issues.created.toLocaleDateString()), /*#__PURE__*/React.createElement("td", null, this.props.issues.type));
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
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "id"), /*#__PURE__*/React.createElement("th", null, "Title"), /*#__PURE__*/React.createElement("th", null, "Author"), /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", null, "Created"), /*#__PURE__*/React.createElement("th", null, "Type"))), /*#__PURE__*/React.createElement("tbody", null, this.props.issues.map(issue => /*#__PURE__*/React.createElement(IssueRow, {
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
      status: "fresh",
      type: "bug fix"
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
  loadData() {
    setTimeout(() => this.setState({
      issues: initialIssues
    }), 500);
  }
  componentDidMount() {
    this.loadData();
  }
  createIssue(issue) {
    issue.id = this.state.issues.length + 1;
    issue.created = new Date();
    const issueCopy = this.state.issues.slice();
    {/*Deep copy issue array*/}
    issueCopy.push(issue);
    this.setState({
      issues: issueCopy
    });
  }
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