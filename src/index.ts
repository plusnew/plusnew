import component from './interfaces/component';
import PlusnewAbstractElement from './PlusnewAbstractElement';
import factory from './instances/factory';
import RootInstance from './instances/types/Root/Instance';
import Instance from './instances/types/Instance';

class Plusnew {
  /**
   * creates lightweight representation of DOM or ComponentNodes
   */
  public createElement(type: string | number | component<any>, props: any, ...children: PlusnewAbstractElement[]) {
    return new PlusnewAbstractElement(type, props, children);
  }

  /**
   * mounts the root component
   */
  public render(component: component<{}, any>, containerElement: HTMLElement) {
    // Fake RootInstance
    const wrapper = new RootInstance(new PlusnewAbstractElement(component, {}, []), undefined, () => 0);
    wrapper.ref = containerElement;

    while (containerElement.childNodes.length) {
      containerElement.removeChild(containerElement.childNodes[0]);
    }

    return factory(new PlusnewAbstractElement(component, {}, []), wrapper, () => 0);
  }
}

export default Plusnew;
export { Instance };
