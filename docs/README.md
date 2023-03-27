# Packages

As part of UDS, Defense Unicorns and others will want a way to simply and easily create Zarf packages for deploying apps.  [This](https://github.com/defenseunicorns/zarf/issues/1092) is an issue that describes some of the motivation.  The TL;DR:

* The easiest way for a Zarf Package Developer to wrap up a chart, is to use the [charts](https://docs.zarf.dev/docs/user-guide/zarf-schema#components--charts) noun.
* Zarf takes this chart and deploys it as a helm chart
* When Deploying BigBang, all the helm charts are deployed by Flux via [HelmRelease] objects


To a Platform Operator, the difference in how these helm charts are deployed can cause confusion and an increased mental load when managing a system.  The goal is to provide a simple way for a Zarf Package Developer to create a flux wrapped Helm Chart that provides a consistent view to the Platform Operator for running the application.

## The Setup

### The Skeleton

In the [import](./import/) folder, there is a Zarf package that provides the skeleton for shape of the application we're trying to deploy.  It contains a few objects:

* A `Namespace` to deploy the app into.  This defaults to the name of the application
* A `GitRepository` to hold the chart data.  
* A `HelmRelease` to tell Flux to deploy the chart
* A `Secret` to provide configurations to the application for running on top of BigBang

These objects are templated out with a few variables

* `NAME` which defines a name metadata for the app that gets injected into the names for all the objects, and defines the namespace
* `REPO` which defines the git repo that the chart lives in.  This gets added to the [repos] field in the zarf.yaml and gets injected into the `GitRepository`
* `PATH` which defines where in the `REPO` the chart lives.
* `TAG` defines which tag in the `REPO` that should be deployed
* `VALUES_FILE` defines a local file on disk that should be read and injected into the `Secret` for providing default configuration for running on BigBang.


### Consumption

This repo contains a couple of examples of how a Zarf Package Owner would use the skeleton package to create a Zarf package for an app.

#### Minio Operator

Create time configurations are passed to the Zarf.yaml via the [zarf-config.toml](./minio-operator/zarf-config.toml).

```toml
[package]
[package.create]
max_package_size = 1000000000

[package.create.set]
repo = "https://repo1.dso.mil/big-bang/product/packages/minio-operator.git"
tag = "4.5.4-bb.0"
name = "minio-operator"
values_file = "../minio-operator/values.yaml"
path = "./chart"
```


The `[package.create.set]` region provides the package specific values for how to configure the skeleton zarf package that gets imported.  The zarf.yaml imports both components from the skeleton's zarf.yaml:

```yaml
components:
  - name: values
    required: true
    import:
      path: ../import
      name: values
  - name: minio-operator
    required: true  
    description: "Deploy ###ZARF_PKG_VAR_NAME###"
    import:
      path: ../import
      name: app
    images:
      - registry1.dso.mil/ironbank/opensource/minio/operator:v4.5.4
      - registry1.dso.mil/ironbank/opensource/minio/console:v0.21.3
```

The `values` component reads the values file, and injects it into the `Secret`, and then the `app` component injects all the variables into the defined manifests described above.

To deploy,

```bash
$ cd minio-operator
$ zarf package create --confirm
$ zarf package deploy zarf-package-minio-operator-amd64-4.5.4-bb.0.tar.zst --confirm
```

Creates the proper flux objects:

```bash
$ kubectl get hr -n bigbang
NAME              AGE   READY   STATUS
bigbang           24h   True    Release reconciliation succeeded
istio             24h   True    Release reconciliation succeeded
istio-operator    24h   True    Release reconciliation succeeded
kiali             24h   True    Release reconciliation succeeded
kyverno           24h   True    Release reconciliation succeeded
kyvernopolicies   24h   True    Release reconciliation succeeded
loki              24h   True    Release reconciliation succeeded
metrics-server    24h   True    Release reconciliation succeeded
minio-operator    17h   True    Release reconciliation succeeded
monitoring        24h   True    Release reconciliation succeeded
promtail          24h   True    Release reconciliation succeeded
tempo             24h   True    Release reconciliation succeeded
```

#### Minio

Create time configurations are passed to the Zarf.yaml via the [zarf-config.toml](./minio/zarf-config.toml) and get provided to the skeleton in the same way as the Minio Operator

To deploy,

```bash
$ cd minio
$ zarf package create --confirm
$ zarf package deploy zarf-package-minio-amd64-4.5.4-bb.3.tar.zst --confirm
```

And now Minio is also deployed:

```bash
$ kubectl get hr -n bigbang
NAME              AGE   READY   STATUS
bigbang           24h   True    Release reconciliation succeeded
istio             24h   True    Release reconciliation succeeded
istio-operator    24h   True    Release reconciliation succeeded
kiali             24h   True    Release reconciliation succeeded
kyverno           24h   True    Release reconciliation succeeded
kyvernopolicies   24h   True    Release reconciliation succeeded
loki              24h   True    Release reconciliation succeeded
metrics-server    24h   True    Release reconciliation succeeded
minio             17h   True    Release reconciliation succeeded
minio-operator    17h   True    Release reconciliation succeeded
monitoring        24h   True    Release reconciliation succeeded
promtail          24h   True    Release reconciliation succeeded
tempo             24h   True    Release reconciliation succeeded
```

And it deployed its `VirtualService` for istio integration since the package sets `istio.enabled` to true:

```bash
$ kubectl get vs -A        
NAMESPACE    NAME                                      GATEWAYS                  HOSTS                          AGE
kiali        kiali                                     ["istio-system/public"]   ["kiali.bigbang.dev"]          24h
minio        minio-minio-minio-instance                ["istio-system/public"]   ["minio.bigbang.dev"]          17h
minio        minio-minio-minio-instance-api            ["istio-system/main"]     ["minio-api.bigbang.dev"]      17h
monitoring   monitoring-monitoring-kube-alertmanager   ["istio-system/public"]   ["alertmanager.bigbang.dev"]   24h
monitoring   monitoring-monitoring-kube-grafana        ["istio-system/public"]   ["grafana.bigbang.dev"]        24h
monitoring   monitoring-monitoring-kube-prometheus     ["istio-system/public"]   ["prometheus.bigbang.dev"]     24h
tempo        tempo-query                               ["istio-system/public"]   ["tracing.bigbang.dev"]        24h
```


## Future Improvements

### Manually Defining Images

Image discovery is implemented in the BigBang noun, but the more general [Image Discovery issue](https://github.com/defenseunicorns/zarf/issues/337) is still outstanding.  When that's complete, there won't be a need for the Zarf Package Developer to manually specifiy the images for each application.


### Values.yaml path

When specifying the `values_file`, Zarf normalizes the discovery of that file to the [import](./import/) folder.  When defining the `minio` values file, which lives next to the zarf.yaml, it was expected to set that value to be just `values.yaml`, however, when building the zarf package, the following value was needed:

```toml
values_file = "../minio/values.yaml"
```

since that is how to get to the file from the [import](./import/) folder.  I'm unsure how this will look when importing from OCI.  Speaking of....

### OCI

Rather than keeping the skeleton package locally, being able to publicly host that and reference it would make this skeleton easier to share and consume in lots of places.  The zarf.yaml might look something like this:

```yaml
kind: ZarfPackageConfig
metadata:
  name: minio-operator
  description: "minio operator deployment"
  version: 4.5.4-bb.0
  architecture: amd64 

components:
  - name: values
    required: true
    import:
      path: oci://ghcr.io/defenseunicorns/packages/import:v0.1.1
      name: values
  - name: minio-operator
    required: true  
    description: "Deploy ###ZARF_PKG_VAR_NAME###"
    import:
      path: oci://ghcr.io/defenseunicorns/packages/import:v0.1.1
      name: app
    images:
      - registry1.dso.mil/ironbank/opensource/minio/operator:v4.5.4
      - registry1.dso.mil/ironbank/opensource/minio/console:v0.21.3
```

### Clarity on Variables

When building this package, I found it confusing using the different types of variables/constants:

* `CONST` - Create time variables inside of files referenced by the zarf package
* `PKG_VAR` - Create time variables inside the zarf.yaml
* `VAR` - Deploy time variables inside of files refrenced by teh zarf package

Particularly the need to use `PKG_VAR` to set `CONST`s inside the skeleton wouldn't have been solved without being pointed [here](https://github.com/defenseunicorns/zarf/blob/main/packages/zarf-agent/zarf.yaml#L6-L8) after talking to the zarf team.