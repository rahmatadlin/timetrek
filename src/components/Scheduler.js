import React, {Component} from 'react';
import {DayPilot, DayPilotScheduler} from "daypilot-pro-react";

class Scheduler extends Component {

  constructor(props) {
    super(props);
    this.schedulerRef = React.createRef();
    this.state = {
      timeHeaders: [{"groupBy":"Month"},{"groupBy":"Day","format":"d"}],
      scale: "Day",
      days: DayPilot.Date.today().daysInMonth(),
      startDate: DayPilot.Date.today().firstDayOfMonth(),
      timeRangeSelectedHandling: "Enabled",
      onTimeRangeSelected: async (args) => {
        const dp = args.control;
        const modal = await DayPilot.Modal.prompt("Create a new event:", "Event 1");
        dp.clearSelection();
        if (modal.canceled) { return; }
        dp.events.add({
          start: args.start,
          end: args.end,
          id: DayPilot.guid(),
          resource: args.resource,
          text: modal.result
        });
      },
      eventMoveHandling: "Update",
      onEventMoved: (args) => {
        args.control.message("Event moved: " + args.e.text());
      },
      eventResizeHandling: "Update",
      onEventResized: (args) => {
        args.control.message("Event resized: " + args.e.text());
      },
      eventDeleteHandling: "Update",
      onEventDeleted: (args) => {
        args.control.message("Event deleted: " + args.e.text());
      },
      eventClickHandling: "Disabled",
      eventHoverHandling: "Bubble",
      bubble: new DayPilot.Bubble({
        onLoad: (args) => {
          // if the event object doesn't specify "bubbleHtml" property
          // this onLoad handler will be called to provide the bubble HTML
          args.html = "Event details";
        }
      }),
      treeEnabled: true,
    };
  }

  componentDidMount() {

    // load resource and event data
    this.setState({
      resources: [
        {
      name: "Convertible", id: "G2", expanded: true, children: [
        {name: "MINI Cooper", seats: 4, doors: 2, transmission: "Automatic", id: "A"},
        {name: "BMW Z4", seats: 4, doors: 2, transmission: "Automatic", id: "B"},
        {name: "Ford Mustang", seats: 4, doors: 2, transmission: "Automatic", id: "C"},
        {name: "Mercedes-Benz SL", seats: 2, doors: 2, transmission: "Automatic", id: "D"},
      ]
    },
    {
      name: "SUV", id: "G1", expanded: true, children: [
        {name: "BMW X1", seats: 5, doors: 4, transmission: "Automatic", id: "E"},
        {name: "Jeep Wrangler", seats: 5, doors: 4, transmission: "Automatic", id: "F"},
        {name: "Range Rover", seats: 5, doors: 4, transmission: "Automatic", id: "G"},
      ]
    },
      ],
      events: [
        {
          id: 1,
          text: "Event 1",
          start: "2024-03-12T00:00:00",
          end: "2024-03-14T00:00:00",
          resource: "A"
        },
        {
          id: 2,
          text: "Event 2",
          start: "2024-03-03T00:00:00",
          end: "2024-03-10T00:00:00",
          resource: "C",
          barColor: "#38761d",
          barBackColor: "#93c47d"
        },
        {
          id: 3,
          text: "Event 3",
          start: "2024-03-02T00:00:00",
          end: "2024-03-08T00:00:00",
          resource: "D",
          barColor: "#f1c232",
          barBackColor: "#f1c232"
        },
        {
          id: 4,
          text: "Event 3",
          start: "2024-03-02T00:00:00",
          end: "2024-03-08T00:00:00",
          resource: "E",
          barColor: "#cc0000",
          barBackColor: "#ea9999"
        }
      ]
    });

  }

  get scheduler() {
    return this.schedulerRef.current.control;
  }

  render() {
    return (
      <div>
        <h1>Calendar</h1>
        <DayPilotScheduler
          {...this.state}
          ref={this.schedulerRef}
        />
      </div>
    );
  }
}

export default Scheduler;
