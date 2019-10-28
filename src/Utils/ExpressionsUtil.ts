export const passes = (store: any, expression: any) => {
    if (expression.type == "EQUALS") {
        return store[expression.key] == expression.value
    }

    if (expression.type == "MORE_THAN") {
        return store[expression.key] > expression.value
    }

    if (expression.type == "MORE_THAN_OR_EQUALS") {
        return store[expression.key] >= expression.value
    }

    if (expression.type == "LESS_THAN") {
        return store[expression.key] < expression.value
    }

    if (expression.type == "LESS_THAN_OR_EQUALS") {
        return store[expression.key] <= expression.value
    }

    if (expression.type == "NOT_EQUALS") {
        return store[expression.key] != expression.value
    }

    if (expression.type == "ALWAYS") {
        return true
    }

    return false
}