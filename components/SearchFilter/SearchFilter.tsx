import * as React from 'react';
import { SearchFilterContainer, SearchFilterContainerRenderProps } from './SearchFilterContainer';
import { SearchFilterView } from './SearchFilterView';

export interface SearchFilterProps {
  /**
   * Title of the button to open the filter
   */
  title: String | null;
  /**
   * Default value, for uncontrolled component
   */
  defaultValue?: boolean;
  /**
   * When set, component will be controlled.
   * If filter is open or not.
   */
  value?: boolean;
  /**
   * Called when status of filter is changed
   */
  onChange?: (open: boolean) => void;
  /**
   * Content in the filter. Will be rendered in the panel.
   */
  children?: any;
}

export class SearchFilter extends React.PureComponent<SearchFilterProps> {
  render() {
    const { title, value, defaultValue, onChange, children } = this.props;

    return (
      <SearchFilterContainer
        defaultValue={defaultValue}
        onChange={onChange}
        value={value}
      >
        {/* @ts-ignore */}
        {({ open, toggle }) => (
          <SearchFilterView
            title={title}
            open={open}
            onClick={toggle}
          >
            {children}
          </SearchFilterView>
        )}
      </SearchFilterContainer>
    );
  }
}
