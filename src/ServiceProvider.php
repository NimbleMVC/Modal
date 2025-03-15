<?php

namespace NimblePHP\Modal;

use Krzysztofzylka\File\File;
use Nimblephp\Framework\Interfaces\ServiceProviderInterface;
use Nimblephp\Framework\Kernel;
use Nimblephp\Framework\ModuleRegister;
use Nimblephp\Twig\Twig;

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