import PlusnewAbstractElement, { PlusnewElement } from './PlusnewAbstractElement';
import factory from './instances/factory';
import componentFactory, { componentResult } from './components/factory';
import RootInstance from './instances/types/Root/Instance';
import InputEvent, { nothing } from './interfaces/InputEvent';
import Instance from './instances/types/Instance';
import { Fragment } from './util/symbols';
import store from 'redchain';
import './interfaces/jsx';

class Plusnew {
  /**
   * creates lightweight representation of DOM or ComponentNodes
   */
  public createElement(type: PlusnewElement, props: any, ...children: PlusnewAbstractElement[]) {
    return new PlusnewAbstractElement(type, props, children);
  }

  /**
   * mounts the root component
   */
  public render(element: PlusnewAbstractElement, containerElement: HTMLElement) {
    // Fake RootInstance
    const wrapper = new RootInstance(true, undefined, () => 0);
    wrapper.ref = containerElement;

    while (containerElement.childNodes.length) {
      containerElement.removeChild(containerElement.childNodes[0]);
    }

    return factory(element, wrapper, () => 0);
  }

  Fragment = Fragment;
}

// @FIXME this is needed to trick typescript into generating .d.ts file
// if a file doesn't export anything other than types, it won't generate the .d.ts file
nothing;

export { store, Plusnew, Instance, componentFactory as component, InputEvent, componentResult };

export default new Plusnew();
