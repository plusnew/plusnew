import Plusnew from 'index';
import component from 'interfaces/component';
import store from 'redchain';

describe('rendering nested components', () => {
  let plusnew: Plusnew;
  let container: HTMLElement;

  beforeEach(() => {
    plusnew = new Plusnew();

    container = document.createElement('div');
    container.innerHTML = 'lots of stuff';
    document.body.appendChild(container);
  });

  it('does a initial list work, with pushing values', () => {
    const local = store('foo', (state: string, newValue: string) => newValue)();

    const change = jasmine.createSpy('change', () => {
      local.dispatch('bar');
    });

    const component: component<{}, {}> = () => {
      return {
        render: () => <input onchange={change} value={local.state}/>,
        dependencies: { local },
      };
    };

    plusnew.render(component, container);

    const input = document.getElementsByTagName('input')[0];
    input.value = 'bar';
    const event = new CustomEvent('input', { detail: { target: input } });
    input.dispatchEvent(event);

    expect(change.calls.count()).toEqual(1);
    expect(change).toHaveBeenCalledWith(event);
  });
});
