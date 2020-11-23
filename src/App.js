import React from "react";
import mondaySdk from "monday-sdk-js";
import { SwipeScreen, InstructionsScreen } from "./components";

import "@fortawesome/fontawesome-free/css/all.css";
import "monday-ui-react-core/dist/main.css";
import "./App.css";

export const monday = mondaySdk();

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
                created_at
                updated_at
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
    const hasSelectedBacklogGroup = this.state.settings.backlog_group ?? false;
    return (
      <div className="App">
        {hasSelectedBacklogGroup ? (
          <SwipeScreen
            loading={this.state.loading}
            items={this.state.items}
            onSwipe={this.onSwipe.bind(this)}
            onTrashButtonPress={() => this.swipeOnTopItem(DELETE_DIR)}
            onKeepButtonPress={() => this.swipeOnTopItem(KEEP_DIR)}
          />
        ) : (
          <InstructionsScreen />
        )}
      </div>
    );
  }
}

export default App;
