import React from "react";
import mondaySdk from "monday-sdk-js";
import { SwipeScreen, InstructionsScreen } from "./components";

import "@fortawesome/fontawesome-free/css/all.css";
import "monday-ui-react-core/dist/main.css";
import "./App.css";

export const monday = mondaySdk();

export const MondayContext = React.createContext();

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
      const prevBacklockGroup = this.state.settings?.backlog_group ?? null;
      this.setState({ settings: res.data });
      if (prevBacklockGroup !== res.data?.backlog_group) {
        this.pullGroupData();
      }
    });
    monday.listen("context", (res) => {
      this.setState({ context: res.data });
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

  onEmptyTrash() {
    if (this.state.trash.length === 0) return;

    const { delete_mode: deleteMode } = this.state.settings;
    const mutationType =
      deleteMode === "delete" ? "delete_item" : "archive_item";
    const mutation = `
      mutation {
        ${this.state.trash.reduce(
          (acc, curr) =>
            acc + `del${curr.id}: ${mutationType}(item_id: ${curr.id}) { id }`,
          ""
        )}
      }
    `;

    this.setState({ loading: true });
    monday.api(mutation).then((res) => {
      this.setState({ loading: false, trash: [] });
    });
  }

  render() {
    const hasSelectedBacklogGroup = this.state.settings.backlog_group ?? false;
    return (
      <MondayContext.Provider value={monday}>
        <div className="App">
          {hasSelectedBacklogGroup ? (
            <SwipeScreen
              loading={this.state.loading}
              items={this.state.items}
              trash={this.state.trash}
              onSwipe={this.onSwipe.bind(this)}
              onTrashButtonPress={() => this.swipeOnTopItem(DELETE_DIR)}
              onKeepButtonPress={() => this.swipeOnTopItem(KEEP_DIR)}
              onEmptyTrash={this.onEmptyTrash.bind(this)}
            />
          ) : (
            <InstructionsScreen />
          )}
        </div>
      </MondayContext.Provider>
    );
  }
}

export default App;
