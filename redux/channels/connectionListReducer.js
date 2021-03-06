const { createMappedNamespaceReducer, createReducer } = require('@ghadyani-framework/redux-utils')

const {
	JOIN_CHANNEL,
	LEAVE_CHANNEL,
} = require('./actions')

const initialState = new Map()

const reducerActions = {
	[JOIN_CHANNEL]: (
		(prevState, { connection }) => (
			new Map(prevState)
			.set(
				connection,
				prevState.get(connection) + 1 || 1
			)
		)
	),

	[LEAVE_CHANNEL]: (
		(prevState, { connection }) => {
			const nextState = new Map(prevState)
			const count = nextState.get(connection) - 1 || 0

			count === 0
			? nextState.delete(connection)
			: nextState.set(connection, count)

			return nextState
		}
	),
}

const connectionListReducer = (
	createMappedNamespaceReducer(
		createReducer(
			reducerActions,
			initialState,
		)
	)
)

module.exports = connectionListReducer
