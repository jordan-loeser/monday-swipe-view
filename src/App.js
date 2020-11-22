import React from "react";
import mondaySdk from "monday-sdk-js";
import { SwipeScreen } from "./components";

import "@fortawesome/fontawesome-free/css/all.css";
import "monday-ui-react-core/dist/main.css";
import "./App.css";

const monday = mondaySdk();

const DELETE_DIR = "left";
const KEEP_DIR = "right";

class App extends React.Component {
  constructor(props) {
    super(props);

    // Default state
    this.state = {
      // Monday Data
      settings: {},
      context: {},
      // App Settings
      loading: false,
      items: [],
      trash: [],
      keep: [],
      // Swipe Management
      lastAction: null,
    };
  }

  pullGroupData() {
    // TODO: add confirmation before overriding existing selections
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
          this.setState({ items: groups[0].items, trash: [], keep: [] });
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

  swipeOnTopItem(direction) {
    const remainingItems = this.state.items;
    if (remainingItems.length > 0) {
      const topItem = remainingItems[remainingItems.length - 1];
      this.onSwipe(direction, topItem);
    }
  }

  onSwipe(direction, swipedItem) {
    console.log("You swiped: " + direction, "on", swipedItem.id);
    if (direction === DELETE_DIR) {
      this.setState((prevState) => ({
        trash: prevState.trash.concat(swipedItem),
        items: prevState.items.filter((item) => swipedItem.id !== item.id),
      }));
    } else if (direction === KEEP_DIR) {
      this.setState((prevState) => ({
        keep: prevState.keep.concat(swipedItem),
        items: prevState.items.filter((item) => swipedItem.id !== item.id),
      }));
    }
    this.setState({ lastAction: { direction, name: swipedItem.name } });
  }

  render() {
    const hasSelectedBacklogGroup = this.state.settings?.backlog_group !== null;
    return (
      <div className="App">
        {hasSelectedBacklogGroup ? (
          <SwipeScreen
            loading={this.state.loading}
            items={this.state.items}
            onSwipe={this.onSwipe}
            onTrashButtonPress={() => this.swipeOnTopItem(DELETE_DIR)}
            onKeepButtonPress={() => this.swipeOnTopItem(KEEP_DIR)}
          />
        ) : (
          <p>
            Please select a backlog group in the settings panel for this view.
          </p>
        )}

        {/* TODO: DELETE AFTER DEV */}
        <div style={{ maxWidth: "500px" }}>
          <p>Group: {this.state.settings?.backlog_group}</p>
          <p>
            {this.state.lastAction &&
              `You just swiped: ${this.state.lastAction?.direction} on ${this.state.lastAction?.name}`}
          </p>
          <p>Items: {JSON.stringify(this.state.items, null, 1)}</p>
          <p>Trash: {JSON.stringify(this.state.trash, null, 1)}</p>
          <p>Keep: {JSON.stringify(this.state.keep, null, 1)}</p>
        </div>
      </div>
    );
  }
}

export default App;
