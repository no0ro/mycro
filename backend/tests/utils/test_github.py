from unittest import TestCase
from unittest.mock import patch, MagicMock
import backend.server.utils.github as github
from backend.tests.testing_utilities import constants

REPO = 'blah'
ORG = 'my_org'
PR_ID = 1

class TestGithub(TestCase):

    def setUp(self):
        os_patch = patch('backend.server.utils.github.os')
        pygithub_patch = patch('backend.server.utils.github.Github')

        self.addCleanup(os_patch.stop)
        self.addCleanup(pygithub_patch.stop)

        self.os_mock = os_patch.start()
        self.os_mock.environ.__getitem__.return_value = constants.GITHUB_ACCESS_TOKEN

        self.pygithub_mock = pygithub_patch.start()

    def test_create_repo(self):
        github.create_repo(REPO, ORG)

        self.pygithub_mock.assert_called_once_with(constants.GITHUB_ACCESS_TOKEN)
        self.pygithub_mock.return_value.get_organization.assert_called_once_with(ORG)
        self.pygithub_mock.return_value.get_organization.return_value.create_repo.assert_called_once_with(name=REPO, auto_init=True)

    def test_merge_pr(self):
        github.merge_pr(REPO, PR_ID, ORG)

        self.pygithub_mock.assert_called_once_with(constants.GITHUB_ACCESS_TOKEN)
        self.pygithub_mock.return_value.get_organization.assert_called_once_with(ORG)
        self.pygithub_mock.return_value.get_organization.return_value.get_repo.assert_called_once_with(REPO)
        self.pygithub_mock.return_value.get_organization.return_value.get_repo.return_value.get_pull.assert_called_once_with(PR_ID)
        self.pygithub_mock.return_value.get_organization.return_value.get_repo.return_value.get_pull.return_value.merge(REPO)
