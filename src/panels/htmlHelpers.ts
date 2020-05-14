const htmlHelpers = {

    addClass: function(parent: HTMLElement, className: string) {
        parent.className = (parent.className + ' ' + className).trim();
    },

    clearChildren: function(element: Element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    },

    hideAll: function(parent: ParentNode, selector: string) {
        const elements = parent.querySelectorAll(selector);
        for (let i = 0; i < elements.length; i++) {
            (elements[i] as any).style.display = 'none';
        }
    },

    newActionLink: function(text: string, action: Function, title?: string) {
        const link = document.createElement('a');
        link.href = '#';
        if (title) {
            link.title = title;
        }
        link.appendChild(document.createTextNode(text));
        link.addEventListener('click', () => action());
        return link;
    },

    newEventLink: function(text: string, event: string, context: any | undefined, postMessage: any, title?: string) {
        const link = document.createElement('a');
        link.href = '#';
        if (title) {
            link.title = title;
        }
        link.appendChild(document.createTextNode(text));
        this.setOnClickEvent(link, event, context, postMessage);
        return link;
    },

    newTableHead: function(...cells: Node[]) {
        return this.newTableRowHelper('th', cells);
    },

    newTableRow: function(...cells: Node[]) {
        return this.newTableRowHelper('td', cells);
    },

    newTableRowHelper: function(cellType: string, cells: Node[]) {
        const row = document.createElement('tr');
        for (let i = 0; i < cells.length; i++) {
            const cell = document.createElement(cellType);
            cell.appendChild(cells[i]);
            row.appendChild(cell);
        }
        return row;
    },

    number: function(n: number) {
        // avoid rounding small values to 0:
        return n.toLocaleString(undefined, { maximumFractionDigits: 20 });
    },

    removeAllClass: function(parent: HTMLElement, className: string) {
        const elements = parent.querySelectorAll('.' + className);
        for (let i = 0; i < elements.length; i++) {
            elements[i].className = elements[i].className.replace(className, '').replace('  ', ' ').trim();
        }
    },

    setEnabled: function(selector: string, isEnabled: boolean) {
        const element = document.querySelector(selector);
        if (element) {
            (element as any).disabled = !isEnabled;
        }
    },

    setInnerPlaceholder: function(element: ParentNode, selector: string, value: Node) {
        const placeHolderElements = element.querySelectorAll(selector);
        if (placeHolderElements && placeHolderElements.length) {
            if (placeHolderElements.length === 1) {
                const placeHolderElement = placeHolderElements[0];
                this.clearChildren(placeHolderElement);
                placeHolderElement.appendChild(value);
            } else {
                for (let i = 0; i < placeHolderElements.length; i++) {
                    const placeHolderElement = placeHolderElements[i];
                    this.clearChildren(placeHolderElement);
                    placeHolderElement.appendChild(value.cloneNode(true));
                }
            }
        }
    },

    setOnClickEvent: function(element: string | Element, event: string, context: any | undefined, postMessage : any) {
        const clickable = (typeof element === 'string') ? document.querySelector(element) : element;
        if (clickable) {
            clickable.addEventListener('click', () => postMessage({ e: event, c: context }));
        }
    },

    setPlaceholder: function(selector: string, value: Node) {
        this.setInnerPlaceholder(document, selector, value);
    },

    showHide: function(selector: string, show: boolean, displayStyle: string = 'block') {
        const element: any = document.querySelector(selector);
        if (element) {
            element.style.display = show ? displayStyle : 'none';
        }
    },

    text: function(content: string) {
        return document.createTextNode(content);
    },
    
    time: function(unixTimestamp: number) {
        return (new Date(unixTimestamp * 1000)).toLocaleString();
    },
};

export { htmlHelpers };