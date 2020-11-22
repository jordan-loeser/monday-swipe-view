import React from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
const monday = mondaySdk();

class App extends React.Component {
  constructor(props) {
    super(props);

    // Default state
    this.state = {
      loading: false,
      settings: {},
      context: {},
      items: [],
    };
  }

  pullGroupData() {
    if (!this.state.settings.backlog_group) return;
    this.setState({ loading: true });
    monday
      .api(
        `query ($boardIds: [Int], $groupIds: [String]) {
          boards(ids:$boardIds, limit:1) {
            groups(ids:$groupIds) {
              items {
                id
                name
              }
            }
          }
        }`,
        {
          variables: {
            boardIds: this.state.context.boardIds,
            groupIds: this.state.settings.backlog_group,
          },
        }
      )
      .then((res) => {
        const { groups } = res.data.boards[0];
        if (groups.length > 0) {
          this.setState({ items: groups[0].items });
        }
        this.setState({ loading: false });
      });
  }

  componentDidMount() {
    monday.listen("settings", (res) => {
      this.setState({ settings: res.data });
      this.pullGroupData();
    });
    monday.listen("context", (res) => {
      this.setState({ context: res.data });
      // TODO: confirm there's no situation where this could change on the same instance
      // this.pullGroupData();
    });
  }

  render() {
    return (
      <div className="App">
        <div>
          <p>{this.state.settings?.backlog_group}</p>
          <p>
            {this.state.loading
              ? "LOADING..."
              : JSON.stringify(this.state.items, null, 1)}
          </p>
        </div>
      </div>
    );
  }
}

export default App;
