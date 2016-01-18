export default function highlight() {
  function escapeRegexp(queryToEscape) {
    return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
  }

  return function(item, query) {
    if (query && item) {
      return item.toString().replace(new RegExp(escapeRegexp(query), 'gi'), '<span class="filter-highlight">$&</span>');
    }
    return item;
  };
}
