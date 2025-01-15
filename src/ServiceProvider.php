<?php

namespace Nimblephp\modal;

use Krzysztofzylka\File\File;
use Nimblephp\framework\Interfaces\ServiceProviderInterface;
use Nimblephp\framework\Kernel;
use Nimblephp\framework\ModuleRegister;
use Nimblephp\twig\Twig;

class ServiceProvider implements ServiceProviderInterface
{

    public function register(): void
    {
        File::copy(__DIR__ . '/Resources/modal.js', Kernel::$projectPath . '/public/assets/modal.js');

        if (ModuleRegister::moduleExistsInVendor('nimblephp/twig')) {
            try {
                Twig::addJsHeader('/assets/modal.js');
            } catch (\Throwable) {
            }
        }
    }

}