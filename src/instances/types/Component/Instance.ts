import types from '../types';
import Instance from '../Instance';
import factory from '../../factory';
import componentReconcile from './reconcile';
import PlusnewAbstractElement from 'PlusnewAbstractElement';
import LifeCycleHandler from './LifeCycleHandler';
import component, { ApplicationElement, props } from 'interfaces/component';
import scheduler from 'scheduler';

export default class ComponentInstance extends Instance {
  public type = types.Component;
  public abstractElement: PlusnewAbstractElement;
  public children: Instance;
  private renderFunction: (props: props) => ApplicationElement;
  private lifeCycleHandler: LifeCycleHandler;
  private abstractChildren: ApplicationElement;
  private dirty: boolean;

  constructor(abstractElement: PlusnewAbstractElement, parentInstance: Instance, previousAbstractSiblingCount: () => number) {    
    super(abstractElement, parentInstance, previousAbstractSiblingCount);
    this.initialiseComponent()
        .handleChildren();
  }

  /**
   * calls the renderfunction with the properties and gives lifecyclehooks to the applicationcode
   */
  private initialiseComponent() {
    const props = this.abstractElement.props;
    this.lifeCycleHandler = new LifeCycleHandler(this);
    this.renderFunction = (this.abstractElement.type as component<any>)(this.lifeCycleHandler, props);
    this.dirty = false;

    return this;
  }

  private handleChildren() {
    this.abstractChildren = this.renderFunction(this.abstractElement.props);
    // children might should be an array and not an arrayinstance, but I'm not sure yet
    this.children = factory(this.abstractChildren, this, () => this.previousAbstractSiblingCount());
  }

  /**
   * sets the component to a state where it needs a rerender
   */
  public setDirty() {
    if (this.dirty === false) {
      this.dirty = true;
      scheduler.add(this.update.bind(this));
    }

    return this;
  }

  /**
   * when the dirtyflag is set, unsets the dirtyflag and rerenders and informs the domhandler
   */
  private update() {
    // The dirtyflag is needed, if the setDirty and the scheduler are called multiple times
    if (this.dirty === true) {
      this.dirty = false;
      componentReconcile(this.renderFunction(this.abstractElement.props), this);
    }

    return this;
  }

  public getLength() {
    return this.children.getLength();
  }

  /**
   * removes the children from the dom
   */
  public remove() {
    this.children.remove();

    return this;
  }
}
