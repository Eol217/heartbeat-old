const groupsSummaryReducer = (result, current) => {
    const {group, createdAt, updatedAt} = current
    const groupInfo = result[group]

    if (!groupInfo) {
        result[group] = {
            group,
            instances: "1",
            createdAt,
            updatedAt,
        }

        return result
    }

    result[group].instances = String(++groupInfo.instances)
    result[group].createdAt = Math.min(groupInfo.createdAt, createdAt)
    result[group].updatedAt = Math.max(groupInfo.updatedAt, updatedAt)

    return result
}

export {
    groupsSummaryReducer,
}
