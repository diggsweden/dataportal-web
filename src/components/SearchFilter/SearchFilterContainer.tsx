import * as React from 'react';
import ClickOutside from 'click-outside-render-prop';

export interface SearchFilterContainerRenderProps {
    toggle: () => any;
    open: boolean;
}

export interface SearchFilterContainerProps {
    /**
     * Default value, for uncontrolled component
     */
    defaultValue?: boolean;
    /**
     * When set, component will be controlled.
     * If filter is open or not
     */
    value?: boolean;
    /**
     * Called when status of filter is changed
     */
    onChange?: (open: boolean) => void;
    children?: (props: SearchFilterContainerRenderProps) => JSX.Element;
}

interface SearchFilterContainerState {
    open: boolean;
}

export class SearchFilterContainer extends React.Component<SearchFilterContainerProps, SearchFilterContainerState> {
    state = {
        open: true,
    };

    componentDidMount() {
        this.setState({open:this.props.defaultValue || false});
    };

    toggleOpen = ({ open }: SearchFilterContainerState) => {
        return { open: !open }
    };

    toggle = () => {
        this.setState(
            this.toggleOpen,
            () => this.props.onChange && this.props.onChange(this.state.open)
        );
    };

    clickOutside = ({ open }: SearchFilterContainerState) => {
        return { open: false }
    };

    handleClick = () => {
        this.setState(this.clickOutside);
    }

    render() {
        const { children } = this.props;
        const { open } = this.state;

        return (
            <ClickOutside onClickOutside={this.handleClick}>
                {({ref}) => (
                    <div ref={ref}>
                        {children ? children({toggle: this.toggle, open, }) : null}
                    </div>
                )}
            </ClickOutside>
        );
    }
}