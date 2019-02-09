import m from 'mithril';
import Title from './title';
import Text from './text';

export default {
  view: function() {
    return m('header.header', [
      m(Title),
      m(Text),
      m('img.header__img.hoverable', {
        src: 'dist/img/mithril.jpg',
        alt: "mithril"
      })
    ])
  }
}