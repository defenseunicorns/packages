module.exports = async ({github}) => {
 return github.rest.packages.listPackagesForOrganization({
    package_type: 'container',
    org: 'defenseunicorns'
  });
}
