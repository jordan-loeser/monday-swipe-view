import React from "react";
import mondaySdk from "monday-sdk-js";
import TinderCard from "react-tinder-card";
import styled from "styled-components";
import { Button } from "monday-ui-react-core";

import "@fortawesome/fontawesome-free/css/all.css";
import "monday-ui-react-core/dist/main.css";
import "./App.css";

const monday = mondaySdk();

// We want this to take up space even if there are no cards...
const CardContainer = styled.div`
  width: 100vh;
  max-width: 260px;
  min-height: 300px;
`;

const Swipable = styled(TinderCard)`
  position: absolute;
`;

const Card = styled.div`
  cursor: pointer;
  user-select: none;
  position: relative;
  background-color: #fff;
  width: 80vw;
  max-width: 260px;
  height: 300px;
  border-radius: 20px;
  background-size: cover;
  background-position: center;
  border: 1px solid #e9e9e9;
`;

const ButtonContainer = styled.div`
  padding: 24px;
`;

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

  trashItem(itemToTrash) {
    console.log("removing: " + itemToTrash.id);
    this.setState((prevState) => ({
      trash: prevState.trash.concat(itemToTrash),
      items: prevState.items.filter((item) => itemToTrash.id !== item.id),
    }));
  }

  keepItem(itemToKeep) {
    console.log("keeping: " + itemToKeep.id);
    this.setState((prevState) => ({
      keep: prevState.keep.concat(itemToKeep),
      items: prevState.items.filter((item) => itemToKeep.id !== item.id),
    }));
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
    direction === DELETE_DIR
      ? this.trashItem(swipedItem)
      : this.keepItem(swipedItem);
    this.setState({ lastAction: { direction, name: swipedItem.name } });
  }

  onCardLeftScreen(myIdentifier) {
    console.log(myIdentifier + " left the screen");
  }

  renderCards() {
    const hasSelectedBacklogGroup = this.state.settings?.backlog_group !== null;
    if (!hasSelectedBacklogGroup) {
      return (
        <CardContainer>
          <p>Select a backlog board in your settings!</p>
        </CardContainer>
      );
    }
    return (
      <>
        <CardContainer>
          {this.state?.items.map((item, i) => (
            <Swipable
              key={`swipe-${i}`}
              onSwipe={(dir) => this.onSwipe(dir, item)}
              onCardLeftScreen={() => this.onCardLeftScreen(item)}
              preventSwipe={["up", "down"]}
            >
              <Card>{item.name}</Card>
            </Swipable>
          ))}
        </CardContainer>
        <ButtonContainer>
          <Button
            size={Button.sizes.MEDIUM}
            rightIcon="fa fa-chevron-right"
            onClick={() => this.swipeOnTopItem(DELETE_DIR)}
          >
            Trash It
          </Button>
          <Button
            size={Button.sizes.MEDIUM}
            rightIcon="fa fa-chevron-right"
            onClick={() => this.swipeOnTopItem(KEEP_DIR)}
          >
            Keep It
          </Button>
        </ButtonContainer>
      </>
    );
  }

  render() {
    return (
      <div className="App">
        <div>
          <p>Group: {this.state.settings?.backlog_group}</p>
          {this.state.loading ? <p>"LOADING..."</p> : this.renderCards()}
          <div style={{ maxWidth: "500px" }}>
            <p>
              {this.state.lastAction &&
                `You just swiped: ${this.state.lastAction?.direction} on ${this.state.lastAction?.name}`}
            </p>
            <p>Items: {JSON.stringify(this.state.items, null, 1)}</p>
            <p>Trash: {JSON.stringify(this.state.trash, null, 1)}</p>
            <p>Keep: {JSON.stringify(this.state.keep, null, 1)}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
