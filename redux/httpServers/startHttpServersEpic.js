const { combineLatest } = require('rxjs')
const { configurationSetSelector } = require('@ghadyani-framework/node/redux/configurations/selectors')
const { defaultConfigurationsNamespace } = require('@ghadyani-framework/node/redux/configurations/actions')
const { ignoreElements, switchMap, tap } = require('rxjs/operators')
const { ofTaskName } = require('@ghadyani-framework/node')
const { ofType } = require('redux-observable')
const { START_TASK } = require('@ghadyani-framework/node/redux/tasks/actions')
const { stateSelector } = require('@ghadyani-framework/redux-utils')

const getServerUrl = require('./utils/getServerUrl')
const onListening = require('./utils/onListening')
const { httpServerSelector } = require('./selectors')

const configurationSetProps = {
	namespace: defaultConfigurationsNamespace,
}

const startHttpServersEpic = (
	action$,
	state$,
) => (
	action$
	.pipe(
		ofType(START_TASK),
		ofTaskName(
			'serve',
			'undefined',
		),
		switchMap(() => (
			combineLatest(
				stateSelector({
					props: configurationSetProps,
					selector: configurationSetSelector,
					state$,
				}),
				stateSelector({
					selector: httpServerSelector,
					state$,
				}),
			)
		)),
		tap(([
			{
				hostname,
				port,
				protocol,
			},
			httpServer,
		]) => (
			httpServer
			.listen(
				port,
				(
					onListening(
						'WebSocket Server running as',
						(
							getServerUrl({
								hostname,
								port,
								protocol,
							})
							.replace('http', 'ws')
						)
					)
				)
			)
		)),
		ignoreElements(),
	)
)

module.exports = startHttpServersEpic
