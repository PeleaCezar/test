import { render } from 'react-dom';
import './index.css';
import * as React from 'react';
import {
  ScheduleComponent,
  ViewsDirective,
  ViewDirective,
  WorkWeek,
  Inject,
  Resize,
  DragAndDrop,
} from '@syncfusion/ej2-react-schedule';

import {
  // extend,
  closest,
  remove,
  addClass,
  removeClass,
} from '@syncfusion/ej2-base';

import { Internationalization } from '@syncfusion/ej2-base';
import { TreeViewComponent } from '@syncfusion/ej2-react-navigations';
import { DateTimePickerComponent } from '@syncfusion/ej2-react-calendars';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { SampleBase } from './sample-base';
import  SchedulingService  from "./services/SchedulingService";
import { format } from 'date-fns';

const scheduleData = [
  {
    "Id": 1,
    "Subject": "Programarea Calculatorelor",
    "Teacher": "Marius Marian",
    "Group": "CR1.1B",
    "StartTime": "2022-04-18T08:00:00.000Z",
    "EndTime": "2022-04-18T10:00:00.000Z",
    "SubjectType": "Lab"
  },
  {
    "Id": 2,
    "Subject": "Fizica 2",
    "Teacher": "Marcel Puchin",
    "Group": "CR1.3A",
    "StartTime": "2022-04-18T12:00:00.000Z",
    "EndTime": "2022-04-18T14:00:00.000Z",
    "SubjectType": "Course"
  }, {
    "Id": 3,
    "Subject": "Teoria Sistemelor",
    "Teacher": "Dan Popescu",
    "Group": "CR2.2A",
    "StartTime": "2022-04-19T10:00:00.000Z",
    "EndTime": "2022-04-19T12:00:00.000Z",
    "SubjectType": "Course"
  }, {
    "Id": 4,
    "Subject": "Electrotehnica",
    "Teacher": "Petre Nicolae",
    "Group": "CR1.2A",
    "StartTime": "2022-04-20T14:00:00.000Z",
    "EndTime": "2022-04-20T16:00:00.000Z",
    "SubjectType": "Lab"
  }, {
    "Id": 5,
    "Subject": "Fizica",
    "Teacher": "Marcel Puchin",
    "Group": "CR1.1A",
    "StartTime": "2022-04-21T16:00:00.000Z",
    "EndTime": "2022-04-21T18:00:00.000Z",
    "SubjectType": "Seminar"
  }
]


const dragAndDropItems = [
  {
    "Id": 1,
    "Subject": "Algebra-Daniel-Laborator"
  },
  {
    "Id": 2,
    "Subject": "Mate-Jack-Course"
  },
  {
    "Id": 3,
    "Subject": "History-Dan-Seminar"
  },
  {
    "Id": 4,
    "Subject": "PC-Janet-Course"
  },
  {
    "Id": 4,
    "Subject": "Fizics-Vlad-Laborator"
  }
]


export class EditorTemplate extends SampleBase {
  constructor() {
    super(...arguments);
    this.isTreeItemDropped = false;
    this.draggedItemId = '';
    this.allowDragAndDrops = true;
    this.previousEventTarget = '';
    this.instance = new Internationalization();
    this.editorTemplate = this.editorTemplate.bind(this);
    this.fields = {
      dataSource: dragAndDropItems,
      id: 'Id',
      text: 'Name',
    };
  }
  scheduleObj;
  allSubjects = [
    { Subject: 'Algebra', Id: '1' },
    { Subject: 'Fizica 1', Id: '2' },
    { Subject: 'Fizica 2', Id: '3' },
  ];
  subjectList = ['Algebra', 'Fizica 1', 'Fizica 2'];
  classes = [
    { name: 'S6N', id: '1' },
    { name: 'S7A', id: '2' },
    { name: 'C4', id: '3' },
    { name: 'C3', id: '4' },
    { name: 'C6', id: '5' },
  ];
  clsList = ['S6N', 'S7A', 'C4', 'C3', 'C6'];
  allowAdd = false;

  async onActionBegin(event) {
    debugger;
    if (event.requestType === 'eventCreate') {
        if (!this.allowAdd) {
            let startTimeTest = event.data[0].StartTime
            let endTimeTest = event.data[0].EndTime
            event.cancel = true;
            
            try {
            const response = await SchedulingService.create({
              startTime: format(new Date(startTimeTest), 'yyyy-MM-dd kk:mm:ss'),
              endTime: format(new Date(endTimeTest), 'yyyy-MM-dd kk:mm:ss'),
              classId: event.data[0].ClassId,
              subjectId: event.data[0].SubjectId,
              semiGroupId: "3"
            })

            if(response.data)
            {
              debugger;
              response.data.startTime = startTimeTest;
              response.data.endTime = endTimeTest;
              this.allowAdd = true;
              this.scheduleObj.addEvent(response.data);
            }    
            } catch (error) {
              console.log(error)
            }
        }
        else {
            this.allowAdd = false;
        }
    }
    if (event.requestType === 'eventCreate' && this.isTreeItemDropped) {
        let treeViewData = this.treeObj.fields.dataSource;
        const filteredSubjects = treeViewData.filter(
            (item) => item.Id !== this.draggedItemId
        );
        this.treeObj.fields.dataSource = filteredSubjects;
        let elements = document.querySelectorAll(
            '.e-drag-item.treeview-external-drag'
        );
        for (let i = 0; i < elements.length; i++) {
            remove(elements[i]);
        }
    }
}

  async onTreeDragStop(event) {
    if (this.previousEventTarget) {
      removeClass([this.previousEventTarget], 'highlight');
    }
    let treeElement = closest(event.target, '.e-treeview');
    let classElement =
      this.scheduleObj.element.querySelector('.e-device-hover');
    if (classElement) {
      classElement.classList.remove('e-device-hover');
    }
    if (!treeElement) {
      event.cancel = true;
      let scheduleElement = closest(event.target, '.e-content-wrap');
      if (scheduleElement) {
        let treeviewData = this.treeObj.fields.dataSource;

        if (event.target.classList.contains('e-work-cells')) {
          const filteredData = treeviewData.filter(
            (item) => item.Id === parseInt(event.draggedNodeData.id)
          );
          let cellData = this.scheduleObj.getCellDetails(event.target);

          let eventData = {
            SubjectId: filteredData[0].Id,
            StartTime: cellData.startTime,
            EndTime: cellData.endTime,
            Classes: this.classes
          };

          this.scheduleObj.openEditor(eventData, 'Add', true);
          this.isTreeItemDropped = true;
          this.draggedItemId = event.draggedNodeData.id;
        }
      }
    }
  }

  treeTemplate(props) {
    const subjectDetails = props.Subject.split("-");
    return (
      <div id="waiting">
        <div id="waitdetails">
          <div id="waitlist">{subjectDetails[2]}</div>
          <div id="waitsubject">
            {subjectDetails[1]} - {subjectDetails[0]}
          </div>
        </div>
      </div>
    );
  }

  onItemDrag(event) {
    if (event.name === 'drag') {
      if (this.previousEventTarget) {
        removeClass([this.previousEventTarget], 'highlight');
      }
      this.previousEventTarget = event.event.target;
      if (event.event.target.classList.contains('e-work-cells')) {
        addClass([event.event.target], 'highlight');
      }
    }
    if (this.scheduleObj.isAdaptive) {
      let classElement =
        this.scheduleObj.element.querySelector('.e-device-hover');
      if (classElement) {
        classElement.classList.remove('e-device-hover');
      }
      if (event.target.classList.contains('e-work-cells')) {
        addClass([event.target], 'e-device-hover');
      }
    }
    if (document.body.style.cursor === 'not-allowed') {
      document.body.style.cursor = '';
    }
    if (event.name === 'nodeDragging') {
      let dragElementIcon = document.querySelectorAll(
        '.e-drag-item.treeview-external-drag .e-icon-expandable'
      );
      for (let i = 0; i < dragElementIcon.length; i++) {
        dragElementIcon[i].style.display = 'none';
      }
      if (this.previousEventTarget) {
        removeClass([this.previousEventTarget], 'highlight');
      }
      if (event.target.classList.contains('e-work-cells')) {
        this.previousEventTarget = event.target;
        addClass([event.target], 'highlight');
      }
    }
  }

  dragStop(event) {
    if (this.previousEventTarget) {
      removeClass([this.previousEventTarget], 'highlight');
    }
  }

  async onCellClick(args) {

    let eventData = {
      StartTime: args.startTime,
      EndTime: args.endTime,
      Classes: this.classes
    };
    this.scheduleObj.openEditor(eventData, 'Add', true);
  }

  onEventRendered(args) {
    if (args.data.SubjectType === "Course") {
      args.element.style.backgroundColor = "#357cd2";
    } else if (args.data.SubjectType === "Lab") {
      args.element.style.backgroundColor = "#ea7a57";
    } else if (args.data.SubjectType === "Seminar") {
      args.element.style.backgroundColor = "#D1C61B";
    }
  }

  eventTemplate(props) {
    return (<div className="template-wrap">
        <div className="Subject" >{props.Subject}</div>
        <div className="class">{props.Class}</div>
        <div className="teacher">{props.Teacher}</div></div>)
  }

  majorSlotTemplate(props) {
    return (<div>{this.instance.formatDate(props.date, { skeleton: 'Hm' })}</div>);
  }

  editorTemplate(props) {

    return props !== undefined ? (
      <table
        className="custom-event-editor"
        style={{ width: '100%' }}
        cellPadding={5}
      >
        <tbody>
          <tr>
            <td className="e-textlabel">Subject</td>
            <td colSpan={4}>
              <DropDownListComponent
                id="subject"
                placeholder="Subject - Teacher"
                data-name="SubjectId"
                className="e-field"
                style={{ width: '100%' }}
                dataSource={this.allSubjects}
                fields={{ text: 'Subject', value: 'Id' }}
                value={props.SubjectId || null}
              ></DropDownListComponent>
            </td>
          </tr>
          <tr>
            <td className="e-textlabel">Clasa</td>
            <td colSpan={4}>
              <DropDownListComponent
                id="class"
                placeholder="Clasa"
                data-name="ClassId"
                className="e-field"
                style={{ width: '100%' }}
                dataSource={props.Classes}
                fields={{ text: 'name', value: 'id' }}
              ></DropDownListComponent>
            </td>
          </tr>
          <tr>
            <td className="e-textlabel">De la</td>
            <td colSpan={4}>
              <DateTimePickerComponent
                format="HH:mm"
                timeFormat="HH:mm"
                strictMode={true}
                step={120}
                id="StartTime"
                name="StartTime"
                value={new Date(props.StartTime)}
                className="e-field"
              ></DateTimePickerComponent>
            </td>
          </tr>
          <tr>
            <td className="e-textlabel">Pana la</td>
            <td colSpan={4}>
              <DateTimePickerComponent
                format="HH:mm"
                timeFormat="HH:mm"
                strictMode={true}
                step={120}
                id="EndTime"
                name="EndTime"
                value={props.EndTime}
                className="e-field"
              ></DateTimePickerComponent>
            </td>
          </tr>
        </tbody>
      </table>
    ) : (
      <div></div>
    );
  }

  render() {
    return (
      <div className="schedule-control-section">
        <div className="col-lg-12 control-section">
          <div className="control-wrapper drag-sample-wrapper">
            <div className="schedule-container">
              <div className="title-container">
                <h1 className="title-text">Reservations</h1>
              </div>
              <ScheduleComponent
                ref={(schedule) => (this.scheduleObj = schedule)}
                currentView='WorkWeek'
                timezone='Romania/Bucharest'
                selectedDate={new Date(2022, 3, 18)}
                timeScale={{ enable: true, interval: 60, slotCount: 0.5, majorSlotTemplate: this.majorSlotTemplate.bind(this) }}
                showHeaderBar={false}
                showQuickInfo={false}
                cellClick={this.onCellClick.bind(this)}
                editorTemplate={this.editorTemplate}
                eventRendered={this.onEventRendered.bind(this)}
                cssClass="schedule-drag-drop"
                eventDragArea="schedule-drag-drop"
                width="100%"
                height="650px"
                eventSettings={{
                  dataSource: scheduleData,
                  template: this.eventTemplate.bind(this),
              }}
                actionBegin={this.onActionBegin.bind(this)}
                drag={this.onItemDrag.bind(this)}
                dragStop={this.dragStop.bind(this)}         
              >
                <ViewsDirective>
                  <ViewDirective option='WorkWeek' startHour='08:00' endHour='20:00' />
                </ViewsDirective>
                <Inject
                  services={[WorkWeek, Resize, DragAndDrop]}
                />
              </ScheduleComponent>
            </div>
          </div>
          <div className="treeview-container">
            <div className="title-container">
              <h1 className="title-text"> Subjects</h1>
            </div>
            <TreeViewComponent
              ref={(tree) => (this.treeObj = tree)}
              cssClass="treeview-external-drag"
              dragArea=".drag-sample-wrapper"
              nodeTemplate={this.treeTemplate.bind(this)}
              fields={this.fields}
              nodeDragStop={this.onTreeDragStop.bind(this)}
              nodeDragging={this.onItemDrag.bind(this)}
              allowDragAndDrop={this.allowDragAndDrops}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  schedulings: state.schedulings
});

render(<EditorTemplate />, document.getElementById('sample'));
